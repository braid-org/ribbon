export type Resource<T> = {
  version: number;
  subscriptions: Set<any>;
  value: T;
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
