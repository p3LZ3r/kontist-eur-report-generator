import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavigationSidebar from '../components/NavigationSidebar';
import type { NavigationSection, ProgressState } from '../types';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    CheckCircle: () => <div data-testid="check-circle">CheckCircle</div>,
    Circle: () => <div data-testid="circle">Circle</div>,
    User: () => <div data-testid="user">User</div>,
    TrendingUp: () => <div data-testid="trending-up">TrendingUp</div>,
    TrendingDown: () => <div data-testid="trending-down">TrendingDown</div>,
    Calculator: () => <div data-testid="calculator">Calculator</div>,
    HelpCircle: () => <div data-testid="help-circle">HelpCircle</div>
}));

describe('NavigationSidebar', () => {
    const mockSections: NavigationSection[] = [
        {
            id: 'personal',
            title: 'Persönliche Daten',
            description: 'Steuerpflichtige Personendaten',
            icon: 'user',
            fields: ['1', '2', '3', '4', '5', '6', '7'],
            completed: false,
            required: true
        },
        {
            id: 'income',
            title: 'Einnahmen',
            description: 'Betriebseinnahmen',
            icon: 'trending-up',
            fields: ['17', '18', '19'],
            completed: true,
            required: true
        },
        {
            id: 'expenses',
            title: 'Ausgaben',
            description: 'Betriebsausgaben',
            icon: 'trending-down',
            fields: ['25', '26', '27'],
            completed: false,
            required: true
        },
        {
            id: 'totals',
            title: 'Summen',
            description: 'Gesamtbeträge',
            icon: 'calculator',
            fields: ['52', '54'],
            completed: false,
            required: true
        }
    ];

    const mockProgress: ProgressState = {
        totalSections: 4,
        completedSections: 1,
        totalFields: 20,
        completedFields: 7,
        mandatoryFields: 15,
        completedMandatoryFields: 7
    };

    const mockOnSectionChange = vi.fn();
    const mockOnHelpToggle = vi.fn();

    it('renders navigation sections correctly', () => {
        render(
            <NavigationSidebar
                sections={mockSections}
                currentSection="personal"
                progress={mockProgress}
                onSectionChange={mockOnSectionChange}
                onHelpToggle={mockOnHelpToggle}
                helpVisible={false}
            />
        );

        // Check if all section titles are rendered
        expect(screen.getByText('Persönliche Daten')).toBeInTheDocument();
        expect(screen.getByText('Einnahmen')).toBeInTheDocument();
        expect(screen.getByText('Ausgaben')).toBeInTheDocument();
        expect(screen.getByText('Summen')).toBeInTheDocument();
    });

    it('displays progress information correctly', () => {
        render(
            <NavigationSidebar
                sections={mockSections}
                currentSection="personal"
                progress={mockProgress}
                onSectionChange={mockOnSectionChange}
                onHelpToggle={mockOnHelpToggle}
                helpVisible={false}
            />
        );

        expect(screen.getByText('Gesamtfortschritt')).toBeInTheDocument();
        expect(screen.getByText('1/4 Abschnitte')).toBeInTheDocument();
        expect(screen.getByText('Felder')).toBeInTheDocument();
        expect(screen.getByText('7/20')).toBeInTheDocument();
        expect(screen.getByText('Pflichtfelder')).toBeInTheDocument();
        expect(screen.getByText('7/15')).toBeInTheDocument();
    });

    it('shows correct icons for different sections', () => {
        render(
            <NavigationSidebar
                sections={mockSections}
                currentSection="personal"
                progress={mockProgress}
                onSectionChange={mockOnSectionChange}
                onHelpToggle={mockOnHelpToggle}
                helpVisible={false}
            />
        );

        expect(screen.getByTestId('user')).toBeInTheDocument();
        expect(screen.getByTestId('trending-up')).toBeInTheDocument();
        expect(screen.getByTestId('trending-down')).toBeInTheDocument();
        expect(screen.getByTestId('calculator')).toBeInTheDocument();
    });

    it('shows completion status with correct icons', () => {
        render(
            <NavigationSidebar
                sections={mockSections}
                currentSection="personal"
                progress={mockProgress}
                onSectionChange={mockOnSectionChange}
                onHelpToggle={mockOnHelpToggle}
                helpVisible={false}
            />
        );

        // Income section should show check circle (completed)
        const incomeSection = screen.getByText('Einnahmen').closest('button');
        expect(incomeSection).toBeInTheDocument();

        // Other sections should show circle (not completed)
        const personalSection = screen.getByText('Persönliche Daten').closest('button');
        expect(personalSection).toBeInTheDocument();
    });

    it('calls onSectionChange when section is clicked', async () => {
        const user = userEvent.setup();

        render(
            <NavigationSidebar
                sections={mockSections}
                currentSection="personal"
                progress={mockProgress}
                onSectionChange={mockOnSectionChange}
                onHelpToggle={mockOnHelpToggle}
                helpVisible={false}
            />
        );

        const incomeButton = screen.getByText('Einnahmen').closest('button');
        await user.click(incomeButton!);

        expect(mockOnSectionChange).toHaveBeenCalledWith('income');
    });

    it('highlights current section', () => {
        render(
            <NavigationSidebar
                sections={mockSections}
                currentSection="income"
                progress={mockProgress}
                onSectionChange={mockOnSectionChange}
                onHelpToggle={mockOnHelpToggle}
                helpVisible={false}
            />
        );

        const incomeButton = screen.getByText('Einnahmen').closest('button');
        expect(incomeButton).toHaveClass('bg-primary');
    });

    it('calls onHelpToggle when help button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <NavigationSidebar
                sections={mockSections}
                currentSection="personal"
                progress={mockProgress}
                onSectionChange={mockOnSectionChange}
                onHelpToggle={mockOnHelpToggle}
                helpVisible={false}
            />
        );

        const helpButton = screen.getByLabelText('Hilfe umschalten');
        await user.click(helpButton);

        expect(mockOnHelpToggle).toHaveBeenCalled();
    });

    it('shows help text', () => {
        render(
            <NavigationSidebar
                sections={mockSections}
                currentSection="personal"
                progress={mockProgress}
                onSectionChange={mockOnSectionChange}
                onHelpToggle={mockOnHelpToggle}
                helpVisible={false}
            />
        );

        expect(screen.getByText(/Navigieren Sie durch die ELSTER-Abschnitte/)).toBeInTheDocument();
        expect(screen.getByText(/Pflichtfelder sind mit einem roten Sternchen markiert/)).toBeInTheDocument();
    });

    it('displays field counts for each section', () => {
        render(
            <NavigationSidebar
                sections={mockSections}
                currentSection="personal"
                progress={mockProgress}
                onSectionChange={mockOnSectionChange}
                onHelpToggle={mockOnHelpToggle}
                helpVisible={false}
            />
        );

        expect(screen.getByText('7 Felder')).toBeInTheDocument();
        expect(screen.getAllByText('3 Felder')).toHaveLength(2); // Einnahmen and Ausgaben both have 3 fields
        expect(screen.getByText('2 Felder')).toBeInTheDocument();
    });
});