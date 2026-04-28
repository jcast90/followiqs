"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface KanbanColumn {
  id: string;
  title: string;
  accent?: string;
}

export interface KanbanCard {
  id: string;
  columnId: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  meta?: React.ReactNode;
}

export interface KanbanBoardProps {
  columns: KanbanColumn[];
  cards: KanbanCard[];
  onCardMove?: (cardId: string, toColumn: string) => void;
  onCardClick?: (card: KanbanCard) => void;
  renderCard?: (card: KanbanCard) => React.ReactNode;
  className?: string;
}

export function KanbanBoard({
  columns,
  cards,
  onCardMove,
  onCardClick,
  renderCard,
  className,
}: KanbanBoardProps) {
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [overCol, setOverCol] = React.useState<string | null>(null);

  const grouped = React.useMemo(() => {
    const map: Record<string, KanbanCard[]> = {};
    columns.forEach((c) => (map[c.id] = []));
    cards.forEach((card) => {
      if (map[card.columnId]) map[card.columnId].push(card);
    });
    return map;
  }, [columns, cards]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (overCol !== colId) setOverCol(colId);
  };

  const handleDrop = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || dragId;
    if (id && onCardMove) onCardMove(id, colId);
    setDragId(null);
    setOverCol(null);
  };

  return (
    <div className={cn("flex gap-4 overflow-x-auto pb-2", className)}>
      {columns.map((col) => (
        <div
          key={col.id}
          onDragOver={(e) => handleDragOver(e, col.id)}
          onDragLeave={() => overCol === col.id && setOverCol(null)}
          onDrop={(e) => handleDrop(e, col.id)}
          className={cn(
            "flex w-72 shrink-0 flex-col rounded-lg border bg-muted/30 p-3 transition-colors",
            overCol === col.id && "ring-2 ring-primary/50 bg-muted/60"
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">{col.title}</h3>
            <Badge variant="secondary">{grouped[col.id]?.length ?? 0}</Badge>
          </div>
          <div className="flex flex-col gap-2">
            {grouped[col.id]?.map((card) => (
              <div
                key={card.id}
                draggable
                onDragStart={(e) => handleDragStart(e, card.id)}
                onClick={() => onCardClick?.(card)}
                className={cn(
                  "cursor-grab rounded-md border bg-background p-3 shadow-sm transition hover:shadow-md",
                  dragId === card.id && "opacity-50"
                )}
              >
                {renderCard ? (
                  renderCard(card)
                ) : (
                  <>
                    <div className="text-sm font-medium">{card.title}</div>
                    {card.subtitle && (
                      <div className="mt-1 text-xs text-muted-foreground">{card.subtitle}</div>
                    )}
                    {card.tags && card.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {card.tags.map((t) => (
                          <Badge key={t} variant="outline" className="text-[10px]">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {card.meta && <div className="mt-2 text-xs text-muted-foreground">{card.meta}</div>}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
