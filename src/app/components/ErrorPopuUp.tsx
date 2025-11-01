"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

interface ErrorPopUpProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    type?: "error" | "success" | "warning" | "info";
}

export default function ErrorPopUp({ 
    open, 
    onClose, 
    title, 
    message, 
    type = "error" 
}: ErrorPopUpProps) {
    const getIcon = () => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-6 h-6 text-green-500" />;
            case "warning":
                return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
            case "info":
                return <Info className="w-6 h-6 text-blue-500" />;
            default:
                return <AlertCircle className="w-6 h-6 text-red-500" />;
        }
    };

    const getColor = () => {
        switch (type) {
            case "success":
                return {
                    iconBg: "rgba(34, 197, 94, 0.1)",
                    border: "rgba(34, 197, 94, 0.3)",
                    button: "#22c55e"
                };
            case "warning":
                return {
                    iconBg: "rgba(234, 179, 8, 0.1)",
                    border: "rgba(234, 179, 8, 0.3)",
                    button: "#eab308"
                };
            case "info":
                return {
                    iconBg: "rgba(59, 130, 246, 0.1)",
                    border: "rgba(59, 130, 246, 0.3)",
                    button: "#3b82f6"
                };
            default:
                return {
                    iconBg: "rgba(239, 68, 68, 0.1)",
                    border: "rgba(239, 68, 68, 0.3)",
                    button: "#ef4444"
                };
        }
    };

    const colors = getColor();

    const defaultTitle = () => {
        switch (type) {
            case "success":
                return "Success";
            case "warning":
                return "Warning";
            case "info":
                return "Information";
            default:
                return "Error";
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="error-dialog-title"
            aria-describedby="error-dialog-description"
            PaperProps={{
                sx: {
                    backgroundColor: "rgba(31, 41, 55, 0.98)",
                    backdropFilter: "blur(12px)",
                    border: `1px solid ${colors.border}`,
                    borderRadius: "16px",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                    minWidth: "400px",
                    maxWidth: "500px",
                }
            }}
        >
            <DialogTitle
                id="error-dialog-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    paddingTop: "24px",
                    paddingBottom: "16px",
                    color: "#f9fafb",
                }}
            >
                <div
                    style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        backgroundColor: colors.iconBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {getIcon()}
                </div>
                <span style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                    {title || defaultTitle()}
                </span>
            </DialogTitle>
            <DialogContent sx={{ paddingX: "24px", paddingBottom: "8px" }}>
                <DialogContentText
                    id="error-dialog-description"
                    sx={{
                        color: "#d1d5db",
                        fontSize: "0.95rem",
                        lineHeight: 1.7,
                    }}
                >
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ padding: "16px 24px 24px" }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        backgroundColor: colors.button,
                        borderRadius: "10px",
                        fontWeight: 600,
                        textTransform: "none",
                        paddingX: "32px",
                        paddingY: "10px",
                        fontSize: "0.95rem",
                        "&:hover": {
                            backgroundColor: colors.button,
                            opacity: 0.9,
                        },
                    }}
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}
