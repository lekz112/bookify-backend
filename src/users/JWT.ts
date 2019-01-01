import jsonwebtoken from "jsonwebtoken";

export const signJWT = (id: string): string => {
    return jsonwebtoken.sign(
        { id },
        "secret",
        { expiresIn: "7d" }
    );
}