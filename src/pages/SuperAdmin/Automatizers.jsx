import React, { useEffect, useState, } from "react";
import { useSelector } from "react-redux";
import styles from "./Automatizers.module.scss";
import BgWrapper from "../../components/BgWrapper/BgWrapper";
import Header from "../../components/Header/Header";
import path from "../../helpers/routerPath";
import axios from "axios";

const Automatizers = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [filters, setFilters] = useState({
    Product_Category: "",
    Product_Name: "",
    Training_Start_Date: "",
    searchQuery: "",
  });
  const userRole = useSelector((state) => state.auth.user.role);
  

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://zohointegration.goit.global/GoITeens/booking/productPlan/index.php?pass=89sYuEP389aHjT2d`
        );
        setData(res.data.AllProducts);
        setFilteredData(res.data.AllProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Filter data
  useEffect(() => {
    const filtered = data.filter((item) => {
      const matchCategory = filters.Product_Category
        ? item.Product_Category === filters.Product_Category
        : true;
      const matchName = filters.Product_Name
        ? item.Product_Name === filters.Product_Name
        : true;
      const matchDate = filters.Training_Start_Date
        ? item.Training_Start_Date === filters.Training_Start_Date
        : true;
      const matchSearchQuery = filters.searchQuery
        ? item.Product_Name.toLowerCase().includes(filters.searchQuery.toLowerCase())
        : true;
      return matchCategory && matchName && matchDate && matchSearchQuery;
    });
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  }, [filters, data]);

  // Handle page change
  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  return (
    <>
      <Header
  endpoints={
    userRole === 3
      ? [
          { text: "Users", path: path.users },
          { text: "Avaliable Managers", path: path.avaliable },
          { text: "Groups", path: path.groups },
          { text: "Courses", path: path.courses },
          { text: "Search by CRM", path: path.crm },
          { text: "Current Meetings", path: path.currentManagers },
          { text: "History", path: path.history },
          { text: "Team calendar", path: path.teamCalendar },
          { text: "Automatizers", path: path.automatizers },
        ]
      : [
          { text: "Consultations", path: path.consultations },
          { text: "Planning", path: path.planning },
          { text: "CRM", path: path.crm },
          { text: "Analytics", path: path.analytics },
          { text: "Working slots", path: path.workingSlots },
          { text: "Study booking", path: "https://study-booking.netlify.app/MIC" }
        ]
  }
/>
      <section className={styles.main_wrapper}>
        <BgWrapper />
       <div className={styles.content_wrapper}>
        <div className={styles.filters}>
          <select
          className={styles.select}
            value={filters.Product_Category}
            onChange={(e) =>
              setFilters({ ...filters, Product_Category: e.target.value })
            }
          >
            <option value="">All Categories</option>
            {[
              ...new Set(data.map((item) => item.Product_Category)),
            ].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
          className={styles.select}
            value={filters.Product_Name}
            onChange={(e) =>
              setFilters({ ...filters, Product_Name: e.target.value })
            }
          >
            <option value="">All Names</option>
            {[
              ...new Set(data.map((item) => item.Product_Name)),
            ].map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <select
          className={styles.select}
            value={filters.Training_Start_Date}
            onChange={(e) =>
              setFilters({ ...filters, Training_Start_Date: e.target.value })
            }
          >
            <option value="">All Start Dates</option>
            {[
              ...new Set(data.map((item) => item.Training_Start_Date)),
            ].map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>

          <input
          className={styles.search}
            type="text"
            placeholder="Search by Product Name"
            value={filters.searchQuery}
            onChange={(e) =>
              setFilters({ ...filters, searchQuery: e.target.value })
            }
          />
        </div>


        <table className={styles.table}>
          <thead>
            <tr>
              <th>Курс</th>
              <th>Назва групи</th>
              <th>Дата старту</th>
              <th>Заплановано учнів</th>
              <th>Фактично учнів</th>
            </tr>
          </thead>
          <tbody className={styles.table_body}>
            {currentItems.map((item) => (
              <tr key={item.id}>
                <td>{item.Product_Category}</td>
                <td>{item.Product_Name}</td>
                <td>{item.Training_Start_Date}</td>
                <td>{item.Students_plan}</td>
                <td>{item.Students_fact}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <button
            className={styles.pagination__btn}
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
            Page Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
          className={styles.pagination__btn}
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
          >
            Page Next
          </button>
        </div>
        </div>
      </section>
    </>
  );
};

export default Automatizers;
