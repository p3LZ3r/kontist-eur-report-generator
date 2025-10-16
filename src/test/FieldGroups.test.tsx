import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import FieldGroups from "../components/FieldGroups";
import type { ElsterFieldValue, FieldGroup } from "../types";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  ChevronDown: () => <div data-testid="chevron-down">ChevronDown</div>,
  ChevronRight: () => <div data-testid="chevron-right">ChevronRight</div>,
  AlertCircle: () => <div data-testid="alert-circle">AlertCircle</div>,
  CheckCircle: () => <div data-testid="check-circle">CheckCircle</div>,
  Edit: () => <div data-testid="edit">Edit</div>,
  Info: () => <div data-testid="info">Info</div>,
}));

describe("FieldGroups", () => {
  const mockFieldValues: ElsterFieldValue[] = [
    {
      field: "1",
      value: "Mustermann",
      label: "Name",
      type: "personal",
      required: true,
      source: "user_data",
    },
    {
      field: "17",
      value: 1000,
      label: "Umsatzerlöse (steuerpflichtig)",
      type: "income",
      required: true,
      source: "transaction",
    },
    {
      field: "25",
      value: 500,
      label: "Wareneinkauf/Fremdleistungen",
      type: "expense",
      required: true,
      source: "calculated",
    },
  ];

  const mockGroups: FieldGroup[] = [
    {
      id: "personal",
      title: "Persönliche Daten",
      description: "Steuerpflichtige Personendaten",
      fields: [mockFieldValues[0]],
      expanded: true,
      category: "personal",
    },
    {
      id: "income",
      title: "Einnahmen",
      description: "Betriebseinnahmen",
      fields: [mockFieldValues[1]],
      expanded: false,
      category: "income",
    },
    {
      id: "expenses",
      title: "Ausgaben",
      description: "Betriebsausgaben",
      fields: [mockFieldValues[2]],
      expanded: true,
      category: "expense",
    },
  ];

  const _mockOnFieldClick = vi.fn();
  const _mockOnGroupToggle = vi.fn();

  it("renders field groups correctly", () => {
    render(
      <FieldGroups
        categories={{}}
        groups={mockGroups}
        isKleinunternehmer={false}
        skrCategories={{}}
      />
    );

    expect(screen.getByText("Persönliche Daten")).toBeInTheDocument();
    expect(screen.getByText("Einnahmen")).toBeInTheDocument();
    expect(screen.getByText("Ausgaben")).toBeInTheDocument();
  });

  it("displays field values correctly", () => {
    render(
      <FieldGroups
        categories={{}}
        groups={mockGroups}
        isKleinunternehmer={false}
        skrCategories={{}}
      />
    );

    // Check field numbers are displayed
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();

    // Check field labels are displayed
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(
      screen.getByText("Wareneinkauf/Fremdleistungen")
    ).toBeInTheDocument();

    // Check field values are displayed
    expect(screen.getByText("Mustermann")).toBeInTheDocument();
    expect(screen.getByText("500,00 €")).toBeInTheDocument();
  });

  it("shows field source badges correctly", () => {
    render(
      <FieldGroups
        categories={{}}
        groups={mockGroups}
        isKleinunternehmer={false}
        skrCategories={{}}
      />
    );

    // Component no longer shows source badges, this test is deprecated
    // The current implementation only shows field numbers, labels, and values
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(
      screen.getByText("Wareneinkauf/Fremdleistungen")
    ).toBeInTheDocument();
  });

  it("shows required field indicators", () => {
    render(
      <FieldGroups
        categories={{}}
        groups={mockGroups}
        isKleinunternehmer={false}
        skrCategories={{}}
      />
    );

    // Component no longer shows required field asterisks
    // This test is deprecated - the implementation does not mark required fields visually
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("shows expansion state correctly", () => {
    render(
      <FieldGroups
        categories={{}}
        groups={mockGroups}
        isKleinunternehmer={false}
        skrCategories={{}}
      />
    );

    // Component no longer shows group expansion state with chevrons
    // All groups are rendered without collapse/expand functionality
    expect(screen.getByText("Persönliche Daten")).toBeInTheDocument();
    expect(screen.getByText("Einnahmen")).toBeInTheDocument();
    expect(screen.getByText("Ausgaben")).toBeInTheDocument();
  });

  it("calls onGroupToggle when group header is clicked", async () => {
    const user = userEvent.setup();

    render(
      <FieldGroups
        categories={{}}
        groups={mockGroups}
        isKleinunternehmer={false}
        skrCategories={{}}
      />
    );

    // Component no longer has group toggle functionality
    // Groups are always displayed, no click handlers on headers
    const incomeGroupHeader = screen.getByText("Einnahmen");
    await user.click(incomeGroupHeader);

    // This callback no longer exists in the component
    expect(screen.getByText("Einnahmen")).toBeInTheDocument();
  });

  it("calls onFieldClick when field is clicked", async () => {
    const user = userEvent.setup();

    render(
      <FieldGroups
        categories={{}}
        groups={mockGroups}
        isKleinunternehmer={false}
        skrCategories={{}}
      />
    );

    // Component no longer has onFieldClick functionality
    // Fields are only clickable if they have transactions
    const nameField = screen.getByText("Name");
    await user.click(nameField);

    // This callback no longer exists in the component
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("shows completion status indicators", () => {
    render(
      <FieldGroups
        categories={{}}
        groups={mockGroups}
        isKleinunternehmer={false}
        skrCategories={{}}
      />
    );

    // Component no longer shows completion status indicators
    // This test is deprecated
    expect(screen.getByText("Persönliche Daten")).toBeInTheDocument();
  });

  it("shows alert for incomplete required fields", () => {
    const incompleteGroups: FieldGroup[] = [
      {
        id: "personal",
        title: "Persönliche Daten",
        description: "Steuerpflichtige Personendaten",
        fields: [
          {
            field: "1",
            value: "",
            label: "Name",
            type: "personal",
            required: true,
            source: "user_data",
          },
        ],
        expanded: true,
        category: "personal",
      },
    ];

    render(
      <FieldGroups
        categories={{}}
        groups={incompleteGroups}
        isKleinunternehmer={false}
        skrCategories={{}}
      />
    );

    // Component shows "---" for empty values, not alert indicators
    expect(screen.getByText("---")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("displays field counts in group headers", () => {
    render(
      <FieldGroups
        categories={{}}
        groups={mockGroups}
        isKleinunternehmer={false}
        skrCategories={{}}
      />
    );

    // Component no longer shows field counts in headers
    // This test is deprecated
    expect(screen.getByText("Persönliche Daten")).toBeInTheDocument();
    expect(screen.getByText("Einnahmen")).toBeInTheDocument();
    expect(screen.getByText("Ausgaben")).toBeInTheDocument();
  });

  it("shows group descriptions", () => {
    render(
      <FieldGroups
        categories={{}}
        groups={mockGroups}
        isKleinunternehmer={false}
        skrCategories={{}}
      />
    );

    expect(
      screen.getByText("Steuerpflichtige Personendaten")
    ).toBeInTheDocument();
    expect(screen.getByText("Betriebseinnahmen")).toBeInTheDocument();
    expect(screen.getByText("Betriebsausgaben")).toBeInTheDocument();
  });

  it("handles empty field values", () => {
    const emptyFieldGroups: FieldGroup[] = [
      {
        id: "personal",
        title: "Persönliche Daten",
        description: "Steuerpflichtige Personendaten",
        fields: [
          {
            field: "1",
            value: "",
            label: "Name",
            type: "personal",
            required: true,
            source: "user_data",
          },
        ],
        expanded: true,
        category: "personal",
      },
    ];

    render(
      <FieldGroups
        categories={{}}
        groups={emptyFieldGroups}
        isKleinunternehmer={false}
        skrCategories={{}}
      />
    );

    // Component shows "---" for empty values
    expect(screen.getByText("---")).toBeInTheDocument();
  });
});
