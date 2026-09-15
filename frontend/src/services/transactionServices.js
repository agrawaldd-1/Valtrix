import api from "./api";

export const sendMoneyApi = async ({ to, amount, paymentPin }) => {
    const response = await api.post("/transactions/send", {
        to,
        amount: Number(amount),
        paymentPin,
    });
    return response.data;
};

export const getAllTransactionsApi = async () => {
    const response = await api.get("/transactions");
    return response.data;
};
