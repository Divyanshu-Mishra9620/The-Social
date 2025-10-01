type BatchCallback = () => void;

class BatchUpdater {
  private queue: Set<BatchCallback> = new Set();
  private rafId: number | null = null;

  schedule(callback: BatchCallback) {
    this.queue.add(callback);

    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        this.flush();
      });
    }
  }

  flush() {
    const callbacks = Array.from(this.queue);
    this.queue.clear();
    this.rafId = null;

    callbacks.forEach((cb) => cb());
  }
}

export const batchUpdater = new BatchUpdater();

export function batchUpdate(callback: BatchCallback) {
  batchUpdater.schedule(callback);
}
