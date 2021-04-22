export type InitialResource<T> = {
  value?: T;
  version?: number;
  urlPrefix?: string;
};

export type Resource<T> = {
  value: T;
  version: number;
  subscriptions: Set<any>;
  urlPrefix: string;
};

export interface ArrayResource<T> extends Resource<Array<T>> {}

export function update<T>(resource: Resource<T>, asRecords?) {
  resource.version++;
  for (const response of resource.subscriptions) {
    const data = asRecords ? asRecords(resource.value) : resource.value;
    response.sendVersion({
      "content-type": "application/json",
      "version": resource.version,
      "body": JSON.stringify(data),
    });
  }
}

export function append<T>(resource: ArrayResource<T>, item: T) {
  resource.version++;
  resource.value.push(item);
  for (const response of resource.subscriptions) {
    response.sendVersion({
      "content-type": "application/json",
      "version": resource.version,
      "patches": [
        { unit: "json", range: "[-0:-0]", content: JSON.stringify(item) },
      ],
    });
  }
}
