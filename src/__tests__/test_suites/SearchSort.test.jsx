import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../components/App";

describe("Search and Sort Transactions Test", () => {
  const transactions = [
    {
      id: 1,
      date: "2025-04-01",
      description: "Utilities Bill",
      category: "Bills",
      amount: 120,
    },
    {
      id: 2,
      date: "2025-04-05",
      description: "Gym Membership",
      category: "Health",
      amount: 60,
    },
    {
      id: 3,
      date: "2025-04-10",
      description: "Book Purchase",
      category: "Education",
      amount: 25,
    },
  ];

  beforeEach(() => {
    setFetchResponse(transactions);
  });

  it("filters transactions when the user types into the search input", async () => {
    render(<App />);

    const searchInput = await screen.findByPlaceholderText(
      /search your recent transactions/i
    );
    await userEvent.type(searchInput, "book");

    expect(screen.getByText("Book Purchase")).toBeInTheDocument();
    expect(screen.queryByText("Utilities Bill")).not.toBeInTheDocument();
    expect(screen.queryByText("Gym Membership")).not.toBeInTheDocument();
  });

  it("updates the order of transactions when the sort dropdown changes", async () => {
    render(<App />);

    await screen.findByText("Utilities Bill");

    const rows = () => screen.getAllByRole("row").slice(1); // ignore header
    const getDescriptions = () =>
      rows().map(
        (row) => within(row).getAllByRole("cell")[1].textContent
      );

    expect(getDescriptions()[0]).toContain("Book Purchase");

    const sortSelect = await screen.findByLabelText(/sort transactions/i);
    await userEvent.selectOptions(sortSelect, "category");

    const reorderedDescriptions = getDescriptions();
    expect(reorderedDescriptions[0]).toContain("Utilities Bill");
    expect(reorderedDescriptions[1]).toContain("Book Purchase");
    expect(reorderedDescriptions[2]).toContain("Gym Membership");
  });
});

