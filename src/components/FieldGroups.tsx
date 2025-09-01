import React from 'react';
import { ChevronDown, ChevronRight, AlertCircle, CheckCircle, Edit, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import type { FieldGroup, ElsterFieldValue } from '../types';

interface FieldGroupsProps {
    groups: FieldGroup[];
    onFieldClick: (field: ElsterFieldValue) => void;
    onGroupToggle: (groupId: string) => void;
}

const FieldGroups: React.FC<FieldGroupsProps> = ({
    groups,
    onFieldClick,
    onGroupToggle
}) => {
    const getFieldTypeColor = (source: string) => {
        switch (source) {
            case 'user_data':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'calculated':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'transaction':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getFieldTypeIcon = (source: string) => {
        switch (source) {
            case 'user_data':
                return <CheckCircle size={14} />;
            case 'calculated':
                return <CheckCircle size={14} />;
            case 'transaction':
                return <CheckCircle size={14} />;
            default:
                return <Edit size={14} />;
        }
    };

    const formatValue = (value: number | string) => {
        if (typeof value === 'number') {
            return value.toFixed(2) + ' €';
        }
        return value;
    };

    return (
        <div className="space-y-4">
            {groups.map((group) => (
                <Card key={group.id} className="overflow-hidden">
                    <CardHeader
                        className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => onGroupToggle(group.id)}
                    >
                        <CardTitle className="flex items-center justify-between text-lg">
                            <div className="flex items-center gap-3">
                                {group.expanded ? (
                                    <ChevronDown size={20} className="text-muted-foreground" />
                                ) : (
                                    <ChevronRight size={20} className="text-muted-foreground" />
                                )}
                                <span>{group.title}</span>
                                <Badge variant="outline" className="ml-2">
                                    {group.fields.length} Felder
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                {group.fields.filter(f => f.required && !f.value).length > 0 && (
                                    <AlertCircle size={16} className="text-red-500" />
                                )}
                                {group.fields.filter(f => f.value).length === group.fields.length && (
                                    <CheckCircle size={16} className="text-green-500" />
                                )}
                            </div>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                    </CardHeader>

                    {group.expanded && (
                        <CardContent className="pt-0">
                            <div className="space-y-3">
                                {group.fields.map((field) => (
                                    <div
                                        key={field.field}
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                        onClick={() => onFieldClick(field)}
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="flex-shrink-0">
                                                {field.required && (
                                                    <span className="text-red-500 font-bold">*</span>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm">
                                                        Feld {field.field}: {field.label}
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs px-2 py-0 ${getFieldTypeColor(field.source)}`}
                                                    >
                                                        {getFieldTypeIcon(field.source)}
                                                        <span className="ml-1">
                                                            {field.source === 'user_data' ? 'Auto' :
                                                                field.source === 'calculated' ? 'Berechnet' :
                                                                    field.source === 'transaction' ? 'Transaktionen' : 'Manuell'}
                                                        </span>
                                                    </Badge>
                                                </div>

                                                {field.value ? (
                                                    <div className="text-sm text-muted-foreground mt-1">
                                                        Wert: {formatValue(field.value)}
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-muted-foreground mt-1 italic">
                                                        Nicht ausgefüllt
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <Button variant="ghost" size="sm" className="flex-shrink-0">
                                            <Info size={16} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    )}
                </Card>
            ))}
        </div>
    );
};

export default FieldGroups;