/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-key */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
import React from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { useTable, usePagination, useSortBy } from 'react-table';
import classnames from 'classnames';

import IntlMessages from '../../helpers/IntlMessages';
import DatatablePagination from '../../components/DatatablePagination';

function Table({ columns, data, divided = false, defaultPageSize = 10 }) {
  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: defaultPageSize },
    },
    useSortBy,
    usePagination
  );

  return (
    <>
      <table
        {...getTableProps()}
        className={`r-table table ${classnames({ 'table-divided': divided })}`}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, columnIndex) => (
                <th
                  key={`th_${columnIndex}`}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={
                    column.isSorted
                      ? column.isSortedDesc
                        ? 'sorted-desc'
                        : 'sorted-asc'
                      : ''
                  }
                >
                  {column.render('Header')}
                  <span />
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={`td_${cellIndex}`}
                    {...cell.getCellProps({
                      className: cell.column.cellClass,
                    })}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <DatatablePagination
        page={pageIndex}
        pages={pageCount}
        canPrevious={canPreviousPage}
        canNext={canNextPage}
        pageSizeOptions={[4, 10, 20, 30, 40, 50]}
        showPageSizeOptions={false}
        showPageJump={false}
        defaultPageSize={pageSize}
        onPageChange={(p) => gotoPage(p)}
        onPageSizeChange={(s) => setPageSize(s)}
        paginationMaxSize={pageCount}
      />
    </>
  );
}

export const AttackLog = () => {
  const data = [
    {
      id: 1,
      action: 'Error',
      detail: 'Panic() at the disco!',
      date: '21/11/2020 13:43',
    },
    {
      id: 2,
      action: 'Error',
      detail: 'Panic() at the disco!',
      date: '21/11/2020 13:43',
    },
    {
      id: 3,
      action: 'Error',
      detail: 'Panic() at the disco!',
      date: '21/11/2020 13:43',
    },
    {
      id: 4,
      action: 'Error',
      detail: 'Panic() at the disco!',
      date: '21/11/2020 13:43',
    },
    {
      id: 5,
      action: 'Error',
      detail: 'Panic() at the disco!',
      date: '21/11/2020 13:43',
    },
    {
      id: 6,
      action: 'Error',
      detail: 'Panic() at the disco!',
      date: '21/11/2020 13:43',
    },
  ];
  const cols = React.useMemo(
    () => [
      {
        Header: <IntlMessages id="log.action" />,
        accessor: 'action',
        cellClass: 'text-muted w-10',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: <IntlMessages id="log.detail" />,
        accessor: 'detail',
        cellClass: 'text-muted w-70',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: <IntlMessages id="log.date" />,
        accessor: 'date',
        cellClass: 'text-muted w-20',
        Cell: (props) => <>{props.value}</>,
      },
    ],
    []
  );

  return (
    <Card className="mb-4">
      <CardBody>
        <CardTitle>
          <IntlMessages id="log.log" />
        </CardTitle>
        <Table columns={cols} data={data} />
      </CardBody>
    </Card>
  );
};

export const BotLog = () => {
  const data = [
    {
      id: 1,
      action: 'Error',
      detail: 'Panic() at the disco!',
      date: '21/11/2020 13:43',
    },
    {
      id: 2,
      action: 'Error',
      detail: 'Panic() at the disco!',
      date: '21/11/2020 13:43',
    },
    {
      id: 3,
      action: 'Error',
      detail: 'Panic() at the disco!',
      date: '21/11/2020 13:43',
    },
    {
      id: 4,
      action: 'Error',
      detail: 'Panic() at the disco!',
      date: '21/11/2020 13:43',
    },
    {
      id: 5,
      action: 'Error',
      detail: 'Panic() at the disco!',
      date: '21/11/2020 13:43',
    },
    {
      id: 6,
      action: 'Error',
      detail: 'Panic() at the disco!',
      date: '21/11/2020 13:43',
    },
  ];
  const cols = React.useMemo(
    () => [
      {
        Header: <IntlMessages id="log.action" />,
        accessor: 'action',
        cellClass: 'text-muted w-10',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: <IntlMessages id="log.detail" />,
        accessor: 'detail',
        cellClass: 'text-muted w-70',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: <IntlMessages id="log.date" />,
        accessor: 'date',
        cellClass: 'text-muted w-20',
        Cell: (props) => <>{props.value}</>,
      },
    ],
    []
  );

  return (
    <Card className="mb-4">
      <CardBody>
        <CardTitle>
          <IntlMessages id="log.log" />
        </CardTitle>
        <Table columns={cols} data={data} />
      </CardBody>
    </Card>
  );
};

export const UserLog = () => {
  const data = [
    {
      id: 1,
      action: 'Error',
      detail: 'Panic() at the disco!',
      date: '21/11/2020 13:43',
    },
    {
      id: 2,
      action: 'Error',
      detail: 'Panic() at the disco!',
      date: '21/11/2020 13:43',
    },
    {
      id: 3,
      action: 'Error',
      detail: 'Panic() at the disco!',
      date: '21/11/2020 13:43',
    },
    {
      id: 4,
      action: 'Error',
      detail: 'Panic() at the disco!',
      date: '21/11/2020 13:43',
    },
    {
      id: 5,
      action: 'Error',
      detail: 'Panic() at the disco!',
      date: '21/11/2020 13:43',
    },
    {
      id: 6,
      action: 'Error',
      detail: 'Panic() at the disco!',
      date: '21/11/2020 13:43',
    },
  ];
  const cols = React.useMemo(
    () => [
      {
        Header: <IntlMessages id="log.action" />,
        accessor: 'action',
        cellClass: 'text-muted w-10',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: <IntlMessages id="log.detail" />,
        accessor: 'detail',
        cellClass: 'text-muted w-70',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: <IntlMessages id="log.date" />,
        accessor: 'date',
        cellClass: 'text-muted w-20',
        Cell: (props) => <>{props.value}</>,
      },
    ],
    []
  );

  return (
    <Card className="mb-4">
      <CardBody>
        <CardTitle>
          <IntlMessages id="log.log" />
        </CardTitle>
        <Table columns={cols} data={data} />
      </CardBody>
    </Card>
  );
};
