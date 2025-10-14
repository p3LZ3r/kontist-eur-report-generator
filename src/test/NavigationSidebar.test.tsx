import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavigationSidebar from '../components/NavigationSidebar';
import type { NavigationSection } from '../types';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    CheckCircle: () => <div data-testid="check-circle">CheckCircle</div>,
    Circle: () => <div data-testid="circle">Circle</div>,
    User: () => <div data-testid="user">User</div>,
    TrendingUp: () => <div data-testid="trending-up">TrendingUp</div>,
    TrendingDown: () => <div data-testid="trending-down">TrendingDown</div>,
    Calculator: () => <div data-testid="calculator">Calculator</div>,
    HelpCircle: () => <div data-testid="help-circle">HelpCircle</div>,
    FileText: () => <div data-testid="file-text">FileText</div>
}));

describe('NavigationSidebar', () => {
    const mockSections: NavigationSection[] = [
        {
            id: 'general',
            title: 'Persönliche Daten',
            description: 'Steuerpflichtige Personendaten',
            icon: 'file-text',
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
            id: 'profit',
            title: 'Summen',
            description: 'Gesamtbeträge',
            icon: 'calculator',
            fields: ['52', '54'],
            completed: false,
            required: true
        }
    ];

    const mockOnSectionChange = vi.fn();

    it('renders navigation sections correctly', () => {
        render(
            <NavigationSidebar
                sections={mockSections}
                currentSection="general"
                onSectionChange={mockOnSectionChange}
            />
        );

        // Check if all section titles are rendered
        expect(screen.getByText('Persönliche Daten')).toBeInTheDocument();
        expect(screen.getByText('Einnahmen')).toBeInTheDocument();
        expect(screen.getByText('Ausgaben')).toBeInTheDocument();
        expect(screen.getByText('Summen')).toBeInTheDocument();
    });

    it('displays configuration information at the bottom', () => {
        render(
            <NavigationSidebar
                sections={mockSections}
                currentSection="personal"
                onSectionChange={mockOnSectionChange}
                currentSkr="SKR04"
                isKleinunternehmer={false}
            />
        );

        expect(screen.getByText('Kontenrahmen')).toBeInTheDocument();
        expect(screen.getByText('SKR04')).toBeInTheDocument();
        expect(screen.getByText('Kleinunternehmer')).toBeInTheDocument();
        expect(screen.getByText('Nein')).toBeInTheDocument();
    });

    it('shows correct icons for different sections', () => {
        render(
            <NavigationSidebar
                sections={mockSections}
                currentSection="general"
                onSectionChange={mockOnSectionChange}
            />
        );

        expect(screen.getByTestId('file-text')).toBeInTheDocument();
        expect(screen.getByTestId('trending-up')).toBeInTheDocument();
        expect(screen.getByTestId('trending-down')).toBeInTheDocument();
        expect(screen.getByTestId('calculator')).toBeInTheDocument();
    });

    it('shows all section buttons', () => {
        render(
            <NavigationSidebar
                sections={mockSections}
                currentSection="general"
                onSectionChange={mockOnSectionChange}
            />
        );

        // All sections should be rendered as buttons
        const incomeSection = screen.getByText('Einnahmen').closest('button');
        expect(incomeSection).toBeInTheDocument();

        const generalSection = screen.getByText('Persönliche Daten').closest('button');
        expect(generalSection).toBeInTheDocument();
    });

    it('calls onSectionChange when section is clicked', async () => {
        const user = userEvent.setup();

        render(
            <NavigationSidebar
                sections={mockSections}
                currentSection="general"
                onSectionChange={mockOnSectionChange}
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
                onSectionChange={mockOnSectionChange}
            />
        );

        const incomeButton = screen.getByText('Einnahmen').closest('button');
        expect(incomeButton).toHaveClass('bg-primary');
    });

    it('displays summary cards when euerCalculation is provided', () => {
        const mockCalculation = {
            totalIncome: 10000,
            totalExpenses: 4000,
            profit: 6000,
            privateWithdrawals: 500,
            privateDeposits: 1000
        };

        render(
            <NavigationSidebar
                sections={mockSections}
                currentSection="general"
                onSectionChange={mockOnSectionChange}
                euerCalculation={mockCalculation}
            />
        );

        expect(screen.getByText('Gewinnermittlung')).toBeInTheDocument();
        expect(screen.getByText('Betriebseinnahmen')).toBeInTheDocument();
        expect(screen.getByText('Betriebsausgaben')).toBeInTheDocument();
        expect(screen.getByText('Gewinn / Verlust')).toBeInTheDocument();
        expect(screen.getByText('Private Geldflüsse')).toBeInTheDocument();
        expect(screen.getByText('Privateinlagen')).toBeInTheDocument();
        expect(screen.getByText('Privatentnahmen')).toBeInTheDocument();
    });
});