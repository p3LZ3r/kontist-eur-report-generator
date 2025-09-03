import React from 'react';
import { ChevronDown, ChevronRight, AlertCircle, CheckCircle, Info, Calculator, Euro } from 'lucide-react';
import { Button } from './ui/button';
import type { FieldGroup, ElsterFieldValue } from '../types';

interface FieldGroupsProps {
    groups: FieldGroup[];
    onFieldClick: (field: ElsterFieldValue) => void;
    onGroupToggle: () => void;
}

const FieldGroups: React.FC<FieldGroupsProps> = ({
    groups,
    onFieldClick,
    onGroupToggle
}) => {
    const getFieldStatus = (field: ElsterFieldValue) => {
        if (field.value && field.value !== 0) {
            return { color: 'text-green-600', icon: <CheckCircle size={14} className="text-green-600" /> };
        }
        if (field.required) {
            return { color: 'text-red-600', icon: <AlertCircle size={14} className="text-red-600" /> };
        }
        return { color: 'text-gray-500', icon: <Info size={14} className="text-gray-500" /> };
    };

    const formatValue = (value: number | string) => {
        if (typeof value === 'number') {
            return new Intl.NumberFormat('de-DE', { 
                style: 'currency', 
                currency: 'EUR',
                minimumFractionDigits: 2
            }).format(value);
        }
        return value || '---';
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {groups.map((group) => {
                    const groupTotal = group.fields.reduce((sum, field) => {
                        const value = typeof field.value === 'number' ? field.value : 0;
                        return sum + value;
                    }, 0);
                    const hasFilledFields = group.fields.some(f => f.value && f.value !== 0);
                    const requiredMissing = group.fields.filter(f => f.required && (!f.value || f.value === 0)).length;

                    return (
                        <div key={group.id} className="border border-gray-300 rounded-lg bg-white shadow-sm overflow-hidden">
                            {/* Section Header - Matching ELSTER style */}
                            <div 
                                className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 cursor-pointer hover:from-green-700 hover:to-green-800 transition-all duration-200"
                                onClick={() => onGroupToggle()}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            {group.expanded ? (
                                                <ChevronDown size={20} className="text-white" />
                                            ) : (
                                                <ChevronRight size={20} className="text-white" />
                                            )}
                                            <span className="text-lg font-medium">{group.title}</span>
                                        </div>
                                        {requiredMissing > 0 && (
                                            <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                                {requiredMissing} Hinweise
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {hasFilledFields && (
                                            <div className="flex items-center gap-1 text-white/90">
                                                <Euro size={16} />
                                                <span className="font-mono text-sm">{formatValue(groupTotal)}</span>
                                            </div>
                                        )}
                                        <div className="bg-white/20 text-white px-2 py-1 rounded text-xs">
                                            {group.fields.length} Felder
                                        </div>
                                    </div>
                                </div>
                                {group.description && (
                                    <p className="text-green-100 text-sm mt-2">{group.description}</p>
                                )}
                            </div>

                            {/* Section Content */}
                            {group.expanded && (
                                <div className="p-6 bg-gray-50">
                                    <div className="space-y-3">
                                        {group.fields.map((field) => {
                                            const status = getFieldStatus(field);
                                            const isRequired = field.required;
                                            const isEmpty = !field.value || field.value === 0;
                                            
                                            return (
                                                <div
                                                    key={field.field}
                                                    className={`flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer ${
                                                        isRequired && isEmpty ? 'border-orange-300 bg-orange-50' : ''
                                                    }`}
                                                    onClick={() => onFieldClick(field)}
                                                >
                                                    <div className="flex items-center gap-4 flex-1">
                                                        {/* Field Number */}
                                                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                                                            {field.field}
                                                        </div>

                                                        {/* Field Info */}
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-medium text-gray-900">
                                                                    {field.label}
                                                                </span>
                                                                {isRequired && (
                                                                    <span className="text-orange-600 font-bold text-xs">*</span>
                                                                )}
                                                            </div>
                                                            
                                                            
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm text-gray-600">Betrag:</span>
                                                                <span className={`font-mono text-sm ${
                                                                    isEmpty ? 'text-gray-400' : 'text-gray-900 font-medium'
                                                                }`}>
                                                                    {formatValue(field.value)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Field Status and Action */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1">
                                                            {status.icon}
                                                        </div>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="text-green-700 border-green-300 hover:bg-green-50"
                                                        >
                                                            <Calculator size={14} className="mr-1" />
                                                            Details
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Section Summary - Similar to ELSTER */}
                                    {hasFilledFields && (
                                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-green-800">Summe {group.title}:</span>
                                                <span className="font-mono text-lg font-bold text-green-800">
                                                    {formatValue(groupTotal)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FieldGroups;