import React,{ useEffect, useState }  from 'react';
import { Fragment } from 'react/cjs/react.production.min';
import "../land-for-sale/land-for-sale.css";
import LandInfo from "../land-for-sale/land-info";
import hcm from '../../assests/hcm.png';
import { useParams, Link, useLocation, useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { LoadLandProvince } from '../../redux/action';

const options = [
    { value: '0', content: 'Thông thường' },
    { value: '1', content: 'Tin mới nhất' },
    { value: '2', content: 'Tin cũ nhất' },
    { value: '3', content: 'Giá từ thấp lên cao' },
    { value: '4', content: 'Giá từ cao xuống thấp' },
    { value: '5', content: 'Diện tích từ bé đến lớn' },
    { value: '6', content: 'Diện tích từ lớn đến bé' },
]

const landForSaleLink = "/user/land-for-sale-province";

function LandForSaleProvince() {
  var { id } = useParams();

    function useQuery() {
        const { search } = useLocation();

        return React.useMemo(() => new URLSearchParams(search), [search]);
      }
    let query = useQuery();
    const history = useHistory();
    const Token = Cookies.get("token");
    let pageNumber = query.get("page");
    if(pageNumber === null) pageNumber = 0;

    let sort = query.get("sort");
    if(sort === null) sort = 0;

    const [provinceName, setprovinceName] = useState(null);
    const [currentPage, setCurrentPage] = useState(pageNumber);
    const [sortBy, setSortBy] = useState(sort);
    const [lstLength, setLstLength] = useState(1);
    const [isLogin, setIsLogin] = useState(false);
    const items = [...Array(lstLength)];
    const itemsPerPage = 10;
    const {dataLandProvince} = useSelector(state => state.commonReducer)
    const dispatch = useDispatch();
    ////////////////////////////////////////////////////////////////
    // We start with an empty list of items.
    const [currentItems, setCurrentItems] = useState(pageNumber);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [isBusy, setIsBusy] = useState(true)


    useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, lstLength]);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setCurrentPage(event.selected);
    setItemOffset(newOffset);
    window.scrollTo(0, 0);
    history.push( landForSaleLink + `/${id}?page=` + event.selected);
    };
    ////////////////////////////////////////////////////////////////
    useEffect(() => {
        setCurrentPage(pageNumber);
    }, [pageNumber])

    useEffect(() => {
        async function getdataLandProvince() {
            fetch(`${process.env.REACT_APP_API_URL}/api/v1/real-estate/sale-province?page=${currentPage}&sort=${sortBy}&province=${id}`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " +  Token,
                }
            })
            .then(res => res.json())
            .then(data => {
                data.realEstates.map(value =>{
                    if(value.pictures.length === 0) value.pictures = [hcm];

                    //convert date string to diffDays
                    const  date = new Date(value.dateUpload);
                    const dateNow = new Date();
                    const diffTime = Math.abs(dateNow - date);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    value.dateUpload = diffDays + " ngày trước";
                    ///////////////////////////
                    //convert price to trieu, ty
                    const billion = 1000000000;
                    const million = 1000000;
                    const price = value.detail.totalPrice;
                    if(price >= billion) {
                        value.detail.totalPrice = (price / billion).toFixed(2) + " tỷ";
                    } else if(price >= million) {
                        value.detail.totalPrice = (price / million).toFixed(2) + " triệu";
                    }

                    return value
                })
                setLstLength(data.lengthDocuments);
                dispatch(LoadLandProvince(data.realEstates))
                setprovinceName(data.realEstates[0].detail.address.province_Id.name)
            })
            .catch(err => console.log(err));
            setIsBusy(false)
        };
        getdataLandProvince();
    }, [currentPage, sortBy, isLogin])


    return (
        <Fragment>
            {!isBusy && <div>
                <div className="landforsale__block">
                    <div className="landforsale__container">
                        <div className="landforsale__header">
                        <div className="landforsale__header-left">
                            <p>Nhà đất bán theo khu vực {provinceName}</p>
                            <span style={{fontSize:"14px",fontWeight:"400"}}>Hiện có {lstLength} bất động sản</span>
                        </div>
                        <div className="landforsale__header-right">
                            <select className="landforsale__select"
                            onChange={(option)=>{
                                setSortBy(option.target.value);
                                }}>
                                    {options.map((option) => (
                                    <option key={option.value} value={option.value}>{option.content}</option>
                                    ))}
                            </select>
                        </div>

                        </div>

                        <div className="landforsale__content">
                            {
                            !!dataLandProvince && dataLandProvince.map((data, index) => (
                                <LandInfo
                                    landId={data._id}
                                    isLike={data.tym}
                                    landImage={data.pictures[0]}
                                    landName={data.title}
                                    landPrice={data.detail.totalPrice + " - " + data.detail.square + " m2"}
                                    landAddress={data.detail.address.province_Id.name}
                                    landDescription={data.detail.content}
                                    landTime={data.dateUpload}
                                    landAuthor={data.author.fullName}
                                    imageLength = {data.pictures.length}
                                    key = {data._id}
                                    checkLogin = {setIsLogin}
                                ></LandInfo>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="center">
                    <div className="pagination">
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel={<i className="fas fa-chevron-right"></i>}
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel={<i className="fas fa-chevron-left"></i>}
                            renderOnZeroPageCount={null}
                            activeClassName="active"
                            forcePage={parseInt(currentPage)}
                        />
                    </div>
                </div>
            </div>}
                  
        </Fragment>
      );
}


export default LandForSaleProvince;