import React from 'react'

const  Pagination = ({ currentPage, itemPerPage, length , onChangePage }) => {
    const pagesCount = Math.ceil(length / itemPerPage);
    const pages = [];

    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }

    return (
        <nav aria-label='Page navigation example'>
            <ul className='pagination'>
                <li className={'page-item' + (currentPage === 1 && ' disabled')}>
                    <button
                    className='page-link'
                    aria-disabled={currentPage === 1 ? 'true' : 'false'}
                    onClick={() => onChangePage(currentPage - 1)}>
                    Previous
                    </button>
                </li>
                {pages.map(page => (
                    <li
                    key={page}
                    className={'page-item' + (currentPage === page && ' active')}>
                    <button
                        onClick={() => onChangePage(page)}
                        className='page-link'>
                        {page}
                    </button>
                    </li>
                ))}

                <li
                    className={
                    'page-item' + (currentPage === pagesCount && ' disabled')
                    }>
                    <button
                    className='page-link'
                    aria-disabled={currentPage === pagesCount ? ' true' : ' false'}
                    onClick={() => onChangePage(currentPage + 1)}>
                    Next
                    </button>
                </li>
            </ul>
      </nav>
    )
}

Pagination.getData = (items, currentPage, itemPerPage) =>{
    const start = currentPage * itemPerPage - itemPerPage;
    return items.slice(start, start + itemPerPage);
}

export default Pagination
