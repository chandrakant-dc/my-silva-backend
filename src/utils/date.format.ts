import moment from "moment";

export const formatDate = (dateString: Date) => {
    if (!dateString) return "";

    return moment(dateString).format("DD MMM YYYY");
};