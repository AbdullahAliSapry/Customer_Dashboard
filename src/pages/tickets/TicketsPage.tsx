import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";

import TicketsHeader from "./TicketsHeader";
import TicketsStats from "./TicketsStats";
import TicketsList from "./TicketsList";
import { RootState } from "../../Store/Store";
import { useSelector } from "react-redux";
import { ApiRepository } from "../../Api/ApiRepository";
import { EndPoints } from "../../Api/EndPoints";
import { setTickets } from "../../Store/DashBoardSlice/ticketSlice";
import { Ticket } from "../../interfaces/ticketInterface";

const TicketsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const { tickets } = useSelector((state: RootState) => state.tickets);
  const { user } = useSelector((state: RootState) => state.Auth);
  
  const isRTL = i18n.language === "ar";

  const fetchTickets = async () => {
    const api = new ApiRepository();
    api.getAll<Ticket>(EndPoints.tickets(user?.userId || ""), setTickets);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <Box
      p={3}
      sx={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        backgroundImage: "linear-gradient(to bottom right, #ffffff, #f8fafc)",
      }}>
      <TicketsHeader onRefresh={fetchTickets} />
      <TicketsStats tickets={tickets} />
      <TicketsList tickets={tickets} isRTL={isRTL} />
    </Box>
  );
};

export default TicketsPage;
