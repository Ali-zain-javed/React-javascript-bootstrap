import React, { useState, useEffect, useMemo } from "react";
import { GET_USERS } from "../service";
import { csvmaker, download } from "../utils";

/**
 * Component for the Table with drag and drip
 *
 * @component
 * @example props
 *
 * return (
 *  return <Table />
 * )
 *
 * @returns {ReactElement} Table component with drag and drop functionality
 * @author Ali Zain
 */

const Table = () => {
  //Making state for table list , pagination and drag drop item
  const [dragItem, setDragItem] = useState();
  const [list, setList] = useState([]);
  const [paginationObj, setPagination] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);

  ///on page load hooks call in which checking existing local storage and logic for Api call
  useEffect(() => {
    let localData = JSON.parse(localStorage.getItem("myData") || null);
    // if existing data saved in db then laod existing data and store into states ,otherwise call backend for getting data
    if (localData && localData.listData) {
      setPagination(localData.pageination);
      setList(localData.listData);
    } else {
      fetchData(1);
    }
  }, []);

  ///hooks call when sotConfig from table header will call
  useEffect(() => {
    let sortableItems = [...list];
    if (sortConfig !== null && sortableItems && sortableItems.length > 0) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
      setList(sortableItems);
    }
  }, [sortConfig]);

  ///Method for handling fetching data from backend on the base of page number
  const fetchData = async (page) => {
    try {
      const result = await GET_USERS(page);
      let data = {
        pageination: {
          page: result.data.page,
          per_page: result.data.per_page,
          total: result.data.total,
          total_pages: result.data.total_pages,
        },
        listData: result.data.data,
      };
      ///set pagination object and list object into state
      setPagination(data.pageination);
      setList(result.data.data);
      //saved data into local db
      localStorage.setItem("myData", JSON.stringify(data));
    } catch (ex) {
    }
  };

  ///select index on selecting drag item
  const handleDragStart = (index) => {
    setDragItem(index);
  };

  ///handle a method for chaning order of the selected item
  const handleDragEnter = (e, index) => {
    const newList = [...list];
    const item = newList[dragItem];
    newList.splice(dragItem, 1);
    newList.splice(index, 0, item);
    setDragItem(index);
    setList(newList);
  };

  const handleDragLeave = (e) => {};

  const handleDrop = (e) => {};

  ///return total pagination list according from list
  const returnPagination = () => {
    var pages = [];
    for (let i = 0; i < paginationObj.total_pages; i++) {
      pages.push(
        <li
          key={i + 1}
          className={`page-item ${paginationObj.page == i + 1 ? "active" : ""}`}
          onClick={() => fetchData(i + 1)}
        >
          <a className="page-link" href="#">
            {i + 1}
          </a>
        </li>
      );
    }
    return pages;
  };

  //sorting config with keys ,set hooks
  const useSortableData = (key) => {
    setDragItem(null);
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    let sortableItems = [...list];
    setSortConfig({ key: key, direction: direction });
  };

  ///making csv maker according header and rows data
  let csvdata = [];
  csvdata = useMemo(() => csvmaker(list), [list]);

  ///table list and pagination with HTML/Bootstrap
  return (
    <div className="dnd">
      <h3>Table with Drag and Drop</h3>
      {list && list.length > 0 && (
        <div
          onClick={() => download(csvdata)}
          className="float-right mb-4 cursor-pointer"
          style={{ cursor: "pointer" }}
        >
          <a href="#">
            {" "}
            Download CSV <i className="fa fa-fw fa-download"></i>
          </a>
        </div>
      )}
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">
              <span onClick={() => useSortableData("order")}>Order</span>
            </th>
            <th scope="col">
              <span onClick={() => useSortableData("id")}>
                Id
                <i className="fa fa-fw fa-sort"></i>
              </span>
            </th>
            <th scope="col">Profile</th>
            <th scope="col">
              <span onClick={() => useSortableData("first_name")}>
                First Name
                <i className="fa fa-fw fa-sort"></i>
              </span>
            </th>
            <th scope="col">
              {" "}
              <span onClick={() => useSortableData("last_name")}>
                Last Name
                <i className="fa fa-fw fa-sort"></i>
              </span>
            </th>
            <th scope="col">Email</th>
          </tr>
        </thead>
        <tbody>
          {list &&
            list.map((item, index) => (
              <tr
                key={item.email + index}
                style={{ cursor: "pointer" }}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragLeave={(e) => handleDragLeave(e)}
                onDrop={(e) => handleDrop(e)}
                onDragOver={(e) => e.preventDefault()}
              >
                <td key={index} scope="row">
                  {index + 1}
                </td>
                <td key={index + item.id} scope="row">
                  {item.id}
                </td>
                <td key={item.index + item.avatar}>
                  <img
                    key={item.index + item.avatar + 1}
                    height={30}
                    src={item.avatar}
                    alt="alternatetext"
                  />
                </td>
                <td key={item.index + item.first_name}>{item.first_name}</td>
                <td key={item.index + item.last_name}>{item.last_name}</td>
                <td key={item.index + item.email}>{item.email}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="mt-4">
        <nav aria-label="Page navigation " className="float-right">
          <ul className="pagination">
            <li
              className="page-item"
              onClick={() => {
                if (!(paginationObj.page - 1 < 1)) {
                  fetchData(paginationObj.page - 1);
                }
              }}
            >
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
                <span className="sr-only">Previous</span>
              </a>
            </li>
            {paginationObj && returnPagination()}

            <li
              className="page-item"
              onClick={() => {
                if (!(paginationObj.page + 1 > paginationObj.total_pages)) {
                  fetchData(paginationObj.page + 1);
                }
              }}
            >
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
                <span className="sr-only">Next</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Table;
