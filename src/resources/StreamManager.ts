import type { Entity } from '@data-client/rest';

import type { Manager, Middleware } from '@data-client/react';
import { Controller, actionTypes } from '@data-client/react';
import { isEntity } from './isEntity';

/** Updates crypto data using Coinbase websocket stream
 *
 * https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-overview
 */
export default class StreamManager implements Manager {
  protected declare websocket: WebSocket; // | EventSource;
  protected declare createSocket: () => WebSocket; // | EventSource;
  protected declare entities: Record<string, typeof Entity>;
  protected msgQueue: (string | ArrayBufferLike | Blob | ArrayBufferView)[] =
    [];

  protected product_ids: string[] = [];
  protected channels: string[] = [];
  private attempts = 0;
  protected declare connect: () => void;

  constructor(
    createSocket: () => WebSocket, // | EventSource,
    entities: Record<string, typeof Entity>,
  ) {
    this.entities = entities;
    this.createSocket = createSocket;
  }

  middleware: Middleware = controller => {
    this.connect = () => {
      this.websocket = this.createSocket();
      this.websocket.onmessage = event => {
        try {
          const msg = JSON.parse(event.data);
          this.handleMessage(controller, msg);
        } catch (e) {
          console.error('Failed to handle message');
          console.error(e);
        }
      };
      this.websocket.onopen = () => {
        console.info('WebSocket connected');
        // Reset reconnection attempts after a successful connection
        this.attempts = 0;
      };
      this.websocket.onclose = () => {
        console.info('WebSocket disconnected');
        this.reconnect();
      };
      this.websocket.onerror = error => {
        console.error('WebSocket error:', error);
        // Ensures that the onclose handler gets triggered for reconnection
        this.websocket.close();
      };
    };
    return next => async action => {
      switch (action.type) {
        case actionTypes.SUBSCRIBE_TYPE:
        case actionTypes.UNSUBSCRIBE_TYPE:
          const { schema } = action.endpoint;
          // only process registered entities
          if (schema && isEntity(schema) && schema.key in this.entities) {
            if (action.type === actionTypes.SUBSCRIBE_TYPE) {
              this.subscribe(schema.key, action.args[0]?.product_id);
            } else {
              this.unsubscribe(schema.key, action.args[0]?.product_id);
            }

            // consume subscription if we use it
            return Promise.resolve();
          }
        default:
          return next(action);
      }
    };
  };

  init() {
    this.connect();
    this.websocket.addEventListener('open', event => {
      //this.msgQueue.forEach((msg) => this.evtSource.send(msg));
      this.flushSubscribe();
    });
  }
  cleanup() {
    // remove our event handler that attempts reconnection
    this.websocket.onclose = null;
    this.websocket.close();
  }

  protected send(
    data: string | ArrayBufferLike | Blob | ArrayBufferView,
  ): void {
    if (this.websocket.readyState === this.websocket.OPEN) {
      this.websocket.send(data);
    } else {
      this.msgQueue.push(data);
    }
  }

  protected subscribe(channel: string, product_id: string) {
    if (this.websocket.readyState === this.websocket.OPEN) {
      this.product_ids.push(product_id);
      this.channels.push(channel);
      setTimeout(() => this.flushSubscribe(), 5);
    } else {
      this.product_ids.push(product_id);
      this.channels.push(channel);
    }
  }
  protected unsubscribe(channel: string, product_id: string) {
    this.send(
      JSON.stringify({
        type: 'unsubscribe',
        product_ids: [product_id],
        channels: [channel],
      }),
    );
  }

  protected flushSubscribe() {
    if (this.product_ids.length)
      this.send(
        JSON.stringify({
          type: 'subscribe',
          product_ids: this.product_ids,
          channels: this.channels,
        }),
      );
    this.product_ids = [];
    this.channels = [];
  }

  /** Every websocket message is sent here
   *
   * @param controller
   * @param msg JSON parsed message
   */
  protected handleMessage(ctrl: Controller, msg: any) {
    if (msg.type in this.entities) {
      ctrl.set(this.entities[msg.type], msg, msg);
    }
  }

  protected reconnect() {
    // Exponential backoff formula to gradually increase the reconnection time
    setTimeout(
      () => {
        console.info(
          `Attempting to reconnect... (Attempt: ${this.attempts + 1})`,
        );
        this.attempts++;
        this.connect();
      },
      Math.min(10000, (Math.pow(2, this.attempts) - 1) * 1000),
    );
  }

  getMiddleware() {
    return this.middleware;
  }
}
/*
 * TODO:
 *
 * - off screen - slow down the feed
 * - online/offline detection
 * - handle network disconnects
 */
