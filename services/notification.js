const API_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "http://localhost:1337/api";

// ========================================
// GET ALL NOTIFICATIONS
// ========================================
export async function getNotifications(token) {
    try {
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        
        const response = await fetch(
            `${API_URL}/notifications?populate=property&sort=createdAt:desc`, {
                cache: "no-store",
                headers,
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch notifications");
        }

        const result = await response.json();

        return result.data || [];
    } catch (error) {
        console.error("Get Notifications Error:", error);
        return [];
    }
}

// ========================================
// GET SINGLE NOTIFICATION
// ========================================
export async function getNotification(documentId, token) {
    try {
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(
            `${API_URL}/notifications?filters[documentId][$eq]=${documentId}&populate=property`, {
                cache: "no-store",
                headers,
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch notification");
        }

        const result = await response.json();

        if (!result.data || result.data.length === 0) {
            return null;
        }

        return result.data[0];
    } catch (error) {
        console.error("Get Notification Error:", error);
        return null;
    }
}

// ========================================
// GET UNREAD NOTIFICATIONS
// ========================================
export async function getUnreadNotifications(token) {
    try {
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(
            `${API_URL}/notifications?filters[IsRead][$eq]=false&populate=property&sort=createdAt:desc`, {
                cache: "no-store",
                headers,
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch unread notifications");
        }

        const result = await response.json();

        return result.data || [];
    } catch (error) {
        console.error("Unread Notification Error:", error);
        return [];
    }
}

// ========================================
// GET UNREAD COUNT
// ========================================
export async function getUnreadCount(token) {
    try {
        const notifications = await getUnreadNotifications(token);
        return notifications.length;
    } catch (error) {
        console.error("Unread Count Error:", error);
        return 0;
    }
}

// ========================================
// CREATE NOTIFICATION
// ========================================
export async function createNotification(data, token) {
    try {
        const response = await fetch(`${API_URL}/notifications`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                data,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to create notification");
        }

        const result = await response.json();

        return result.data;
    } catch (error) {
        console.error("Create Notification Error:", error);
        return null;
    }
}

// ========================================
// MARK AS READ
// ========================================
export async function markAsRead(documentId, token) {
    try {
        const response = await fetch(
            `${API_URL}/notifications/${documentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    data: {
                        IsRead: true,
                    },
                }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to mark notification as read");
        }

        const result = await response.json();

        return result.data;
    } catch (error) {
        console.error("Mark Read Error:", error);
        return null;
    }
}

// ========================================
// DELETE NOTIFICATION
// ========================================
export async function deleteNotification(documentId, token) {
    try {
        const response = await fetch(
            `${API_URL}/notifications/${documentId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete notification");
        }

        return true;
    } catch (error) {
        console.error("Delete Notification Error:", error);
        return false;
    }
}