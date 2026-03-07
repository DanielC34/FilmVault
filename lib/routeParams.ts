export async function getParam<T>(context: { params: Promise<T> }): Promise<T> {
    return await context.params;
}
