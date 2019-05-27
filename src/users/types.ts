export class Email {
    constructor(readonly value: string) {
        if (value.length == 0) {
            throw new Error("Email cannot be empty");
        }
        // TODO: Email format
    }
}

export class Name {
    constructor(readonly value: string) {
        if (value.length == 0) {
            throw new Error("Name cannot be empty");
        }
    }
}

export class Password {
    constructor(readonly value: string) {
        if (value.length < 6) {
            throw new Error("Password has to be longer than 6 symbols");
        }
    }
}