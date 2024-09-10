import { Api, Function, StackContext, Table } from "sst/constructs";

export function PersonApiStack({ stack }: StackContext) {
    const personsTable = new Table(stack, "PersonsTable", {
        cdk: {
            table: {
                tableName: "PersonsTable",
            },
        },
        fields: {
            id: "string",
            firstName: "string",
            lastName: "string",
            phoneNumber: "string",
            address: "string",
        },
        primaryIndex: { partitionKey: "id" },
    });

    const listPersonFunction = new Function(stack, "GetAllPersons", {
        handler: "packages/lambda/list-persons/main.go",
        runtime: "go1.x",
        environment: {
            TABLE_NAME: "PersonTable"
        },
    });

    const createPersonFunction = new Function(stack, "CreatePerson", {
        handler: "packages/lambda/create-person/main.go",
        runtime: "go1.x",
        environment: {
            TABLE_NAME: "PersonTable"
        },
    });

    // personsTable.grantRead(listPersonFunction);
    // personsTable.grantReadWrite(createPersonFunction);

    const api = new Api(stack, "Api", {
        routes: {
            "GET /persons": listPersonFunction,
            "POST /persons": createPersonFunction,
        }
    });
    stack.addOutputs({
        ApiEndpoint: api.url,
      });
}