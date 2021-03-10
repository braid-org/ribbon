export type Resource<T> = {
  version: number;
  subscriptions: Set<any>;
  value: T;
  urlPrefix: string;
};

export function update<T>(resource: Resource<T>, asData?) {
  resource.version++;
  for (const response of resource.subscriptions) {
    // console.log('response.sendVersion', response.peer, resource.urlPrefix)
    const data = asData ? asData(resource.value) : resource.value;
    response.sendVersion({
      "content-type": "application/json",
      "version": resource.version,
      "body": JSON.stringify(data),
    });
  }
}
