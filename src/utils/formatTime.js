export const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12 : true
    });
  };

  export const formatDate = (date) => {
      const d = new Date(date);
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (d.toDateString() === today) return "Today";
      if (d.toDateString() === yesterday) return "Yesterday";
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

