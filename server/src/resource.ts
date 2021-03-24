export type InitialResource<T> = {
  value?: T;
  version?: number;
  urlPrefix?: string;
}

export type Resource<T> = {
  value: T;
  version: number;
  subscriptions: Set<any>;
  urlPrefix: string;
};


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
