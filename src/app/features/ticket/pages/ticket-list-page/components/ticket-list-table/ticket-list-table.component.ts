import { DatePipe } from "@angular/common";
import {
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";

import { ButtonModule } from "primeng/button";
import { FloatLabelModule } from "primeng/floatlabel";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";

import { TicketService } from "@app/features/ticket/ticket.service";
import { ErrorBoundaryComponent } from "@app/shared/components/error/error-boundary.component";
import { Ticket } from "@app/features/ticket/ticket.model";

@Component({
  selector: "ticket-list-table",
  imports: [
    FormsModule,
    RouterLink,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    FloatLabelModule,
    SelectModule,
    TooltipModule,
    DatePipe,
    ErrorBoundaryComponent,
  ],
  templateUrl: "./ticket-list-table.component.html",
  styleUrl: "./ticket-list-table.component.css",
})
export class TicketListTableComponent {
  protected readonly ticketService = inject(TicketService);

  protected readonly tickets = signal<Ticket[]>([]);

  protected readonly searchQuery = linkedSignal(() => {
    return this.ticketService.selectedAgency()?.valor ?? "";
  });

  protected readonly filteredTickets = computed(() => {
    const tickets = this.tickets() ?? [];

    const query = this.searchQuery()?.toLowerCase() ?? "";
    if (!query) {
      return tickets;
    }

    return tickets.filter(
      (ticket) =>
        ticket.ticketId?.toString().toLowerCase().includes(query) ||
        ticket.number?.toLowerCase().includes(query) ||
        ticket.subject?.toLowerCase().includes(query) ||
        ticket.fechaSolicitud?.toLowerCase().includes(query) ||
        ticket.creadoPor?.valor?.toLowerCase().includes(query) ||
        ticket.status?.valor?.toLowerCase().includes(query) ||
        ticket.agencia?.valor?.toLowerCase().includes(query),
    );
  });
}
