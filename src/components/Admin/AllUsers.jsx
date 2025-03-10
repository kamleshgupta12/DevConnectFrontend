import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllUser, viewUser } from "../../slices/Allusers";
import { deleteUserApi, getAllUserApi, viewUserApi } from '../../services/api/allUserAPI';
import avtar from '../../assets/Logo/stock-vector-profile-placeholder-image-gray-silhouette-no-photo-1153673752.jpg'
import Swal from "sweetalert2";


const AllUsers = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const usersPerPage = 8;
    const dispatch = useDispatch();
    const { allUsers } = useSelector((state) => state.allusers);
    console.log(allUsers);
    const navigate = useNavigate();

    const usersArray = Array.isArray(allUsers) ? allUsers : allUsers?.users || [];

    useEffect(() => {
        // console.log("allUsers state:", allUsers); 
    }, [allUsers]);

    // Delete API 
    const handleDeleteClick = (_id) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteUserApi(_id);

                    dispatch(setAllUser(usersArray.filter(user => user._id !== _id)));
                } catch (error) {
                    console.error('Error deleting user', error);
                }
                swalWithBootstrapButtons.fire({
                    title: "Deleted!",
                    text: "User profile has been deleted.",
                    icon: "success"
                });
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "Your imaginary file is safe :)",
                    icon: "error"
                });
            }
        });
    };

    // View User 
    const handleViewClick = async (_id) => {
        localStorage.setItem("id", _id)
        // const response = await viewUserApi(_id);
        // dispatch(viewUser(response.user));
        // console.log(response,"response");
        navigate('/dashboard/admin/user-profile');
    };

    

    const filteredUsers = usersArray.filter((user) =>
        (user?.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (user?.email?.toLowerCase() || "").includes(search.toLowerCase())
    );

    const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
    const displayedUsers = filteredUsers.slice(
        currentPage * usersPerPage,
        (currentPage + 1) * usersPerPage
    );

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const fetchUsers = async () => {
        try {
            const response = await getAllUserApi();
            dispatch(setAllUser(response.allUser));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);


    return (
        <>
            <nav className="text-sm text-richblack-300 mb-6">
                <ul className="flex space-x-2">
                    <li>
                        <Link to="/" className="hover:text-richblack-100">Home</Link>
                    </li>
                    <span className="text-richblack-400">/</span>
                    <li>
                        <Link to="/dashboard" className="hover:text-richblack-100">Dashboard</Link>
                    </li>
                </ul>
            </nav>

            <div className="p-6">
                {/* User List */}
                <div className="w-full bg-richblack-800 p-6 rounded shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-center text-richblack-50">User List</h2>

                    <input
                        type="text"
                        placeholder="Search by name or email"
                        className="w-full p-3 mb-4 border border-richblack-700 rounded-md bg-richblack-800 text-richblack-100 focus:outline-none focus:ring-2 focus:ring-[#308d46]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* User Table */}
                    <div className="">
                        <table className="w-[100%] border border-richblack-700 rounded-lg shadow-sm">
                            <thead className="bg-green-600 text-white">
                                <tr>
                                    <th className="p-3 text-center">Full Name</th>
                                    <th className="p-3 text-center">Email</th>
                                    <th className="p-3 text-center">Profile Pic</th>
                                    <th className="p-3 text-center">Joined</th>
                                    <th className="p-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedUsers.map((user) => (
                                    <tr key={user?._id} className="border-t hover:bg-richblack-600">
                                        <td className="p-3 text-richblack-100">{user?.firstName} {user?.lastName}</td>
                                        <td className="p-3 text-richblack-100">{user?.email || "N/A"}</td>
                                        <td className="text-center align-middle">
                                            <img
                                                src={user?.image ? user.image : avtar}
                                                alt="User Profile"
                                                className="rounded-full mx-auto" 
                                                width="40"
                                                height="40"
                                            />
                                        </td>

                                        <td className="p-3 text-richblack-100 text-center">
                                            {user?.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : "N/A"}
                                        </td>
                                        <td className="p-3 text-center space-x-2 flex items-center justify-center">
                                            <button onClick={() => handleViewClick(user._id)} className="text-[#308d46] font-bold">View</button>
                                            <button onClick={() => handleDeleteClick(user._id)}
                                                className="text-[#b21616]  border p-1 px-2  rounded-md">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {displayedUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-3 text-center text-richblack-100">No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pageCount > 1 && (
                        <div className="mt-4 flex justify-center">
                            <ReactPaginate
                                previousLabel={"<< Previous"}
                                nextLabel={"Next >>"}
                                pageCount={pageCount}
                                onPageChange={handlePageClick}
                                containerClassName="flex space-x-2 text-richblack-50"
                                activeClassName="font-bold text-white bg-[#308d46]"
                                pageClassName="px-3 py-1 border border-[#308d46] font-bold rounded-md hover:bg-[#308d46] hover:text-white"
                                previousClassName="px-3 py-1 border border-[#308d46] font-bold rounded-md hover:bg-[#308d46] hover:text-white"
                                nextClassName="px-3 py-1 border border-[#308d46] font-bold rounded-md hover:bg-[#308d46] hover:text-white"
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AllUsers;
