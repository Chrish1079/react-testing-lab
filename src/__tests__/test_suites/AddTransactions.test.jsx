import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../components/App";

describe("Add Transactions Test", () => {
  const existingTransactions = [
    {
      id: 1,
      date: "2025-02-01",
      description: "Groceries",
      category: "Food",
      amount: 40,
    },
  ];

  function setupFetchMock() {
    const fetchMock = vi.fn((_, options) => {
      if (!options) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(existingTransactions),
        });
      }

      const body = JSON.parse(options.body);
      return Promise.resolve({
        ok: true,
        status: 201,
        json: () =>
          Promise.resolve({
            ...body,
            id: 99,
          }),
      });
    });

    global.fetch = fetchMock;
    return fetchMock;
  }

  it("adds a new transaction to the table after form submission", async () => {
    setupFetchMock();
    render(<App />);

    const dateInput = await screen.findByLabelText(/date/i);
    const descriptionInput = screen.getByPlaceholderText(/description/i);
    const categoryInput = screen.getByPlaceholderText(/category/i);
    const amountInput = screen.getByPlaceholderText(/amount/i);

    await userEvent.type(dateInput, "2025-02-14");
    await userEvent.type(descriptionInput, "Valentines Dinner");
    await userEvent.type(categoryInput, "Restaurants");
    await userEvent.type(amountInput, "120");

    await userEvent.click(
      screen.getByRole("button", { name: /add transaction/i })
    );

    await waitFor(() =>
      expect(screen.getByText("Valentines Dinner")).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText("Restaurants")).toBeInTheDocument()
    );
  });

  it("sends a POST request with the new transaction data", async () => {
    const fetchMock = setupFetchMock();
    render(<App />);

    const dateInput = await screen.findByLabelText(/date/i);
    const descriptionInput = screen.getByPlaceholderText(/description/i);
    const categoryInput = screen.getByPlaceholderText(/category/i);
    const amountInput = screen.getByPlaceholderText(/amount/i);

    await userEvent.type(dateInput, "2025-03-01");
    await userEvent.type(descriptionInput, "Paycheck");
    await userEvent.type(categoryInput, "Income");
    await userEvent.type(amountInput, "2000");

    await userEvent.click(
      screen.getByRole("button", { name: /add transaction/i })
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    const [, postCall] = fetchMock.mock.calls;
    expect(postCall[0]).toBe("http://localhost:6001/transactions");
    expect(postCall[1]).toMatchObject({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const body = JSON.parse(postCall[1].body);
    expect(body).toMatchObject({
      date: "2025-03-01",
      description: "Paycheck",
      category: "Income",
      amount: "2000",
    });
  });
});

