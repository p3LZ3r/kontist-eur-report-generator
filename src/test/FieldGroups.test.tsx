import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FieldGroups from '../components/FieldGroups';
import type { FieldGroup, ElsterFieldValue } from '../types';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    ChevronDown: () => <div data-testid="chevron-down">ChevronDown</div>,
    ChevronRight: () => <div data-testid="chevron-right">ChevronRight</div>,
    AlertCircle: () => <div data-testid="alert-circle">AlertCircle</div>,
    CheckCircle: () => <div data-testid="check-circle">CheckCircle</div>,
    Edit: () => <div data-testid="edit">Edit</div>,
    Info: () => <div data-testid="info">Info</div>
}));

describe('FieldGroups', () => {
    const mockFieldValues: ElsterFieldValue[] = [
        {
            field: '1',
            value: 'Mustermann',
            label: 'Name',
            type: 'personal',
            required: true,
            source: 'user_data'
        },
        {
            field: '17',
            value: 1000,
            label: 'Umsatzerlöse (steuerpflichtig)',
            type: 'income',
            required: true,
            source: 'transaction'
        },
        {
            field: '25',
            value: 500,
            label: 'Wareneinkauf/Fremdleistungen',
            type: 'expense',
            required: true,
            source: 'calculated'
        }
    ];

    const mockGroups: FieldGroup[] = [
        {
            id: 'personal',
            title: 'Persönliche Daten',
            description: 'Steuerpflichtige Personendaten',
            fields: [mockFieldValues[0]],
            expanded: true,
            category: 'personal'
        },
        {
            id: 'income',
            title: 'Einnahmen',
            description: 'Betriebseinnahmen',
            fields: [mockFieldValues[1]],
            expanded: false,
            category: 'income'
        },
        {
            id: 'expenses',
            title: 'Ausgaben',
            description: 'Betriebsausgaben',
            fields: [mockFieldValues[2]],
            expanded: true,
            category: 'expense'
        }
    ];

    const mockOnFieldClick = vi.fn();
    const mockOnGroupToggle = vi.fn();

    it('renders field groups correctly', () => {
        render(
            <FieldGroups
                groups={mockGroups}
                onFieldClick={mockOnFieldClick}
                onGroupToggle={mockOnGroupToggle}
            />
        );

        expect(screen.getByText('Persönliche Daten')).toBeInTheDocument();
        expect(screen.getByText('Einnahmen')).toBeInTheDocument();
        expect(screen.getByText('Ausgaben')).toBeInTheDocument();
    });

    it('displays field values correctly', () => {
        render(
            <FieldGroups
                groups={mockGroups}
                onFieldClick={mockOnFieldClick}
                onGroupToggle={mockOnGroupToggle}
            />
        );

        // Only expanded groups show their fields
        expect(screen.getByText('Feld 1: Name')).toBeInTheDocument();
        expect(screen.getByText('Feld 25: Wareneinkauf/Fremdleistungen')).toBeInTheDocument();

        // Income group is collapsed, so its field is not visible
        expect(screen.queryByText('Feld 17: Umsatzerlöse (steuerpflichtig)')).not.toBeInTheDocument();

        expect(screen.getByText('Wert: Mustermann')).toBeInTheDocument();
        expect(screen.getByText('Wert: 500.00 €')).toBeInTheDocument();
    });

    it('shows field source badges correctly', () => {
        render(
            <FieldGroups
                groups={mockGroups}
                onFieldClick={mockOnFieldClick}
                onGroupToggle={mockOnGroupToggle}
            />
        );

        // Only visible fields show their badges
        expect(screen.getByText('Auto')).toBeInTheDocument();
        expect(screen.getByText('Berechnet')).toBeInTheDocument();

        // Income group is collapsed, so "Transaktionen" is not visible
        expect(screen.queryByText('Transaktionen')).not.toBeInTheDocument();
    });

    it('shows required field indicators', () => {
        render(
            <FieldGroups
                groups={mockGroups}
                onFieldClick={mockOnFieldClick}
                onGroupToggle={mockOnGroupToggle}
            />
        );

        // Only visible fields show asterisks (personal and expenses groups are expanded)
        const asterisks = screen.getAllByText('*');
        expect(asterisks).toHaveLength(2); // Name field and expense field
    });

    it('shows expansion state correctly', () => {
        render(
            <FieldGroups
                groups={mockGroups}
                onFieldClick={mockOnFieldClick}
                onGroupToggle={mockOnGroupToggle}
            />
        );

        // Personal and expenses groups are expanded
        const chevronDowns = screen.getAllByTestId('chevron-down');
        expect(chevronDowns).toHaveLength(2);

        // Income group is collapsed
        expect(screen.getByTestId('chevron-right')).toBeInTheDocument();
    });

    it('calls onGroupToggle when group header is clicked', async () => {
        const user = userEvent.setup();

        render(
            <FieldGroups
                groups={mockGroups}
                onFieldClick={mockOnFieldClick}
                onGroupToggle={mockOnGroupToggle}
            />
        );

        const incomeGroupHeader = screen.getByText('Einnahmen');
        await user.click(incomeGroupHeader);

        expect(mockOnGroupToggle).toHaveBeenCalledWith('income');
    });

    it('calls onFieldClick when field is clicked', async () => {
        const user = userEvent.setup();

        render(
            <FieldGroups
                groups={mockGroups}
                onFieldClick={mockOnFieldClick}
                onGroupToggle={mockOnGroupToggle}
            />
        );

        const nameField = screen.getByText('Feld 1: Name');
        await user.click(nameField);

        expect(mockOnFieldClick).toHaveBeenCalledWith(mockFieldValues[0]);
    });

    it('shows completion status indicators', () => {
        render(
            <FieldGroups
                groups={mockGroups}
                onFieldClick={mockOnFieldClick}
                onGroupToggle={mockOnGroupToggle}
            />
        );

        // Check circles appear in group headers and field badges
        const checkCircles = screen.getAllByTestId('check-circle');
        expect(checkCircles.length).toBeGreaterThan(3); // More than just group headers
    });

    it('shows alert for incomplete required fields', () => {
        const incompleteGroups: FieldGroup[] = [
            {
                id: 'personal',
                title: 'Persönliche Daten',
                description: 'Steuerpflichtige Personendaten',
                fields: [{
                    field: '1',
                    value: '',
                    label: 'Name',
                    type: 'personal',
                    required: true,
                    source: 'user_data'
                }],
                expanded: true,
                category: 'personal'
            }
        ];

        render(
            <FieldGroups
                groups={incompleteGroups}
                onFieldClick={mockOnFieldClick}
                onGroupToggle={mockOnGroupToggle}
            />
        );

        expect(screen.getByTestId('alert-circle')).toBeInTheDocument();
        expect(screen.getByText('Nicht ausgefüllt')).toBeInTheDocument();
    });

    it('displays field counts in group headers', () => {
        render(
            <FieldGroups
                groups={mockGroups}
                onFieldClick={mockOnFieldClick}
                onGroupToggle={mockOnGroupToggle}
            />
        );

        // All groups have 1 field each
        const fieldCounts = screen.getAllByText('1 Felder');
        expect(fieldCounts).toHaveLength(3);
    });

    it('shows group descriptions', () => {
        render(
            <FieldGroups
                groups={mockGroups}
                onFieldClick={mockOnFieldClick}
                onGroupToggle={mockOnGroupToggle}
            />
        );

        expect(screen.getByText('Steuerpflichtige Personendaten')).toBeInTheDocument();
        expect(screen.getByText('Betriebseinnahmen')).toBeInTheDocument();
        expect(screen.getByText('Betriebsausgaben')).toBeInTheDocument();
    });

    it('handles empty field values', () => {
        const emptyFieldGroups: FieldGroup[] = [
            {
                id: 'personal',
                title: 'Persönliche Daten',
                description: 'Steuerpflichtige Personendaten',
                fields: [{
                    field: '1',
                    value: '',
                    label: 'Name',
                    type: 'personal',
                    required: true,
                    source: 'user_data'
                }],
                expanded: true,
                category: 'personal'
            }
        ];

        render(
            <FieldGroups
                groups={emptyFieldGroups}
                onFieldClick={mockOnFieldClick}
                onGroupToggle={mockOnGroupToggle}
            />
        );

        expect(screen.getByText('Nicht ausgefüllt')).toBeInTheDocument();
    });
});