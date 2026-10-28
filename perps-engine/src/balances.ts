export type UserBalance = {
    email: string;
    balance: number;
};

export const user_balance: UserBalance[] = [
    { email: "alice@example.com", balance: 1000 },
    { email: "bob@example.com", balance: 500 },
];

export function updateBalance(
    email: string,
    type: "deposit" | "withdrawal",
    amount: number,
): number {
    const user = user_balance.find(
        (item) => item.email === email,
    );

    if (!user) {
        throw new Error(`User not found: ${email}`);
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Amount must be a positive finite number");
    }

    if (type === "deposit") {
        user.balance += amount;
    } else {
        if (user.balance < amount) {
            throw new Error("Insufficient balance");
        }

        user.balance -= amount;
    }

    return user.balance;
}