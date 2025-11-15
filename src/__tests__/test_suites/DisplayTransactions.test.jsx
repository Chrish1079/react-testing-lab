import { render, screen } from "@testing-library/react";
import App from "../../components/App";

describe("Display Transactions Test", () => {
  const mockTransactions = [
    {
      id: 1,
      date: "2025-01-01",
      description: "Morning Coffee",
      category: "Food",
      amount: 5.5,
    },
    {
      id: 2,
      date: "2025-01-05",
      description: "Train Ticket",
      category: "Travel",
      amount: 35,
    },
  ];

  beforeEach(() => {
    setFetchResponse(mockTransactions);
  });

  it("displays transactions returned from the server on startup", async () => {
    render(<App />);

    for (const transaction of mockTransactions) {
      expect(
        await screen.findByText(transaction.description)
      ).toBeInTheDocument();
      expect(
        await screen.findByText(transaction.category)
      ).toBeInTheDocument();
    }
  });

  it("renders the Add Transaction form so users can add new entries", async () => {
    render(<App />);

    expect(
      await screen.findByRole("button", { name: /add transaction/i })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/description/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/category/i)
    ).toBeInTheDocument();
  });
});

