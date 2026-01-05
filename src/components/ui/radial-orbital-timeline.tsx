"use client";
import { useState, useEffect, useRef } from "react";

interface TimelineItem {
    id: number;
    title: string;
    content: string;
    icon: React.ElementType;
    status: "completed" | "in-progress" | "pending";
    energy: number;
}

interface RadialOrbitalTimelineProps {
    timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
    timelineData,
}: RadialOrbitalTimelineProps) {
    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
    const [rotationAngle, setRotationAngle] = useState<number>(0);
    const [autoRotate, setAutoRotate] = useState<boolean>(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const orbitRef = useRef<HTMLDivElement>(null);

    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === containerRef.current || e.target === orbitRef.current) {
            setExpandedItems({});
            setAutoRotate(true);
        }
    };

    const toggleItem = (id: number) => {
        setExpandedItems((prev) => {
            const newState = { ...prev };
            Object.keys(newState).forEach((key) => {
                if (parseInt(key) !== id) {
                    newState[parseInt(key)] = false;
                }
            });
            newState[id] = !prev[id];

            if (!prev[id]) {
                setAutoRotate(false);
            } else {
                setAutoRotate(true);
            }
            return newState;
        });
    };

    useEffect(() => {
        let rotationTimer: ReturnType<typeof setInterval>;

        if (autoRotate) {
            rotationTimer = setInterval(() => {
                setRotationAngle((prev) => {
                    const newAngle = (prev + 0.3) % 360;
                    return Number(newAngle.toFixed(3));
                });
            }, 50);
        }

        return () => {
            if (rotationTimer) {
                clearInterval(rotationTimer);
            }
        };
    }, [autoRotate]);

    const calculateNodePosition = (index: number, total: number) => {
        const angle = ((index / total) * 360 + rotationAngle) % 360;
        const radius = 280;
        const radian = (angle * Math.PI) / 180;

        const x = radius * Math.cos(radian);
        const y = radius * Math.sin(radian);

        const zIndex = Math.round(100 + 50 * Math.cos(radian));
        const opacity = Math.max(0.5, Math.min(1, 0.5 + 0.5 * ((1 + Math.sin(radian)) / 2)));
        const scale = 0.85 + 0.3 * ((1 + Math.cos(radian)) / 2);

        return { x, y, zIndex, opacity, scale };
    };

    return (
        <div
            className="orbital-container"
            ref={containerRef}
            onClick={handleContainerClick}
        >
            <div className="orbital-wrapper" ref={orbitRef}>
                {/* Center core */}
                <div className="orbital-core">
                    <div className="orbital-core-inner">
                        <span>AI</span>
                    </div>
                    <div className="orbital-ring orbital-ring-1"></div>
                    <div className="orbital-ring orbital-ring-2"></div>
                </div>

                {/* Orbit track */}
                <div className="orbital-track"></div>

                {/* Nodes */}
                {timelineData.map((item, index) => {
                    const position = calculateNodePosition(index, timelineData.length);
                    const isExpanded = expandedItems[item.id];
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.id}
                            className={`orbital-node ${isExpanded ? 'orbital-node-expanded' : ''}`}
                            style={{
                                transform: `translate(${position.x}px, ${position.y}px) scale(${position.scale})`,
                                zIndex: isExpanded ? 200 : position.zIndex,
                                opacity: isExpanded ? 1 : position.opacity,
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleItem(item.id);
                            }}
                        >
                            {/* Glow effect */}
                            <div
                                className="orbital-glow"
                                style={{
                                    width: `${item.energy * 0.4 + 50}px`,
                                    height: `${item.energy * 0.4 + 50}px`,
                                }}
                            ></div>

                            {/* Node icon */}
                            <div className={`orbital-icon ${isExpanded ? 'orbital-icon-active' : ''}`}>
                                <Icon size={28} />
                            </div>

                            {/* Label */}
                            <div className={`orbital-label ${isExpanded ? 'orbital-label-active' : ''}`}>
                                {item.title}
                            </div>

                            {/* Expanded card */}
                            {isExpanded && (
                                <div className="orbital-card">
                                    <div className="orbital-card-connector"></div>
                                    <h4>{item.title}</h4>
                                    <p>{item.content}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export { RadialOrbitalTimeline };
