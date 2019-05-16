import { PoolClient, QueryConfig } from "pg";

const ValidParameterNameExpression = /^(\w+):?(\w*)$/;

export class PgClient {
    constructor(private poolClient: PoolClient) { }

    async queryOne<T>(query: string, params?: any): Promise<T | undefined> {
        return this.poolClient.query(PgClient.buildQuery(query, params))
            .then(result => {
                if (result.rowCount > 1) {
                    throw new Error("More than one row returned");
                }
                return result.rows[0] as T;
            });
    }

    async query<T>(query: string, params: any): Promise<T[]> {
        const result = await this.poolClient.query(PgClient.buildQuery(query, params));
        return result.rows as T[];
    }

    private static buildQuery<T>(query: string, parameters?: any): QueryConfig {
        let newQuery = query;
        let parameterArray: any[] = [];

        if (parameters) {
            const parameterDetails = Object.keys(parameters).map((k, _) => {
                const match = ValidParameterNameExpression.exec(k);
                if (!match) {
                    throw new Error(`Parameter name is invalid: ${k}`);
                }

                const [key, type] = match.slice(1);
                const value = parameters[k];

                return {
                    name: key,
                    value,
                    type: type ? `::${type}` : '',
                    expression: new RegExp(`:${key}(?!\\w)`, 'g'),
                };
            }).filter((p) => p.expression.test(query));

            newQuery = parameterDetails.reduce(
                (q, p, index) => q.replace(p.expression, `$$${index + 1}${p.type}`),
                query,
            );
            parameterArray = parameterDetails.map((p) => p.value);
        }

        return {
            text: newQuery,
            values: parameterArray,
        };
    }
}
