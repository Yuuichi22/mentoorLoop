import { useEffect, useState } from "react";
import { Settings,MessageCircle, Palette, Plus } from "lucide-react";
export const FloatingActionBtn = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [animate, setAnimate] = useState(false); // Separate animation trigger

    const buttons = [
        { icon: <MessageCircle />, angle: 0,onclick : () => {
            window.location.href = "/chat"
        }}, // Chat
        { icon: <Palette />, angle: -30,onclick : () => {
            console.log("theme toggled")
        }}, // Theme
        { icon: <Plus />, angle: -60,onclick : () => {
            window.location.href = "/publish"
        } }, // Create/Add
    ];

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setAnimate(true), 50); // Small delay for smooth animation
        } else {
            setAnimate(false);
        }
    }, [isOpen]);

    return (
        <div className="fixed bottom-5 right-10 flex flex-col items-end">
            {/* Floating Buttons */}
            <div className="relative h-0">
                {buttons.map((btn, index) => {
                    const radius = -100; // Distance from the main button
                    const x = animate ? radius * Math.cos((btn.angle * Math.PI) / 180) : 0;
                    const y = animate ? radius * Math.sin((btn.angle * Math.PI) / 180) : 0;

                    return (
                        <div
                            key={index}
                            className={`absolute bg-gray-500 rounded-full h-10 w-10 flex items-center justify-center text-white 
                                transition-all duration-300 ease-out`}
                            style={{
                                transform: `translate(${x}px, ${-y}px)`,
                                opacity: isOpen ? 1 : 0,
                            }}
                            onClick={btn.onclick}
                        >
                            {btn.icon}
                        </div>
                    );
                })}
            </div>

            {/* Main Floating Action Button */}
            <div
                className="bg-blue-500 rounded-full h-12 w-12 flex items-center justify-center cursor-pointer text-white shadow-lg transition-all duration-300"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? "X" : <Settings />}
            </div>
        </div>
    );
};
