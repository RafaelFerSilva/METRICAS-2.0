import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 5,
  },
}));

export function SummaryTable(props: {
  sprintTasks: number;
  sprintPoints: any;
  resolvedTasks: number;
  unresolvedTasks: number;
  resolvedPoints: number;
  unresolvedPoints: number;
  bugs: number;
  melhorias: number;
}) {
  return (
    <>
      <h1>Resumo</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">
                Stories na Sprint
              </StyledTableCell>
              <StyledTableCell align="center">
                Stories Finalizadas
              </StyledTableCell>
              <StyledTableCell align="center">
                Stories Para Finalizar
              </StyledTableCell>
              <StyledTableCell align="center">Pontos da Sprint</StyledTableCell>
              <StyledTableCell align="center">Pontos Entregues</StyledTableCell>
              <StyledTableCell align="center">
                Pontos Para Entregar
              </StyledTableCell>
              <StyledTableCell align="center">Bugs</StyledTableCell>
              <StyledTableCell align="center">Melhorias</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableCell align="center">
                {props.sprintTasks}
              </StyledTableCell>
              <StyledTableCell align="center">
                {props.resolvedTasks}
              </StyledTableCell>
              <StyledTableCell align="center">
                {props.unresolvedTasks}
              </StyledTableCell>
              <StyledTableCell align="center">
                {props.sprintPoints}
              </StyledTableCell>
              <StyledTableCell align="center">
                {props.resolvedPoints}
              </StyledTableCell>
              <StyledTableCell align="center">
                {props.unresolvedPoints}
              </StyledTableCell>
              <StyledTableCell align="center">{props.bugs}</StyledTableCell>
              <StyledTableCell align="center">
                {props.melhorias}
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
