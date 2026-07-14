// ── GraphQL Queries (Apollo / fetch style) ───────────────
// Author: S M Abdul Samad Shahid

export const GET_TICKETS = `
  query GetTickets($status: String) {
    tickets(status: $status) {
      id
      customer {
        name
        email
      }
      subject
      message
      status
      priority
      createdAt
      replies {
        agent
        message
        createdAt
      }
    }
  }
`;

export const SEND_REPLY = `
  mutation SendReply($ticketId: Int!, $message: String!, $agent: String!) {
    sendReply(ticketId: $ticketId, message: $message, agent: $agent) {
      id
      message
      createdAt
    }
  }
`;

export const UPDATE_TICKET_STATUS = `
  mutation UpdateTicketStatus($ticketId: Int!, $status: String!) {
    updateTicketStatus(ticketId: $ticketId, status: $status) {
      id
      status
    }
  }
`;

export const GET_TICKET_STATS = `
  query GetTicketStats {
    ticketStats {
      open
      pending
      resolved
      totalToday
    }
  }
`;
