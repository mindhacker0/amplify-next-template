export class EventEmitter {
    private eventMap: Map<string, Array<Function>> = new Map();
    addEventListener(event: string, cb: Function) {
      const callbacks = this.eventMap.get(event) || [];
      callbacks.push(cb);
      this.eventMap.set(event, callbacks);
    }
    removeEventListener(event: string, cb?: Function) {
      if (!cb) {
        this.eventMap.delete(event);
        return;
      }
      const callbacks = this.eventMap.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(cb);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      }
    }
    emit(event: string, ...args: any) {
      const callbacks = this.eventMap.get(event);
      if (!callbacks) {
        return;
      }
      callbacks.forEach((cb) => {
        try {
          cb(...args);
        } catch (error) {
          console.error("event: ", event, cb.toString(), error);
        }
      });
    }
}

export const eventHub = new EventEmitter();