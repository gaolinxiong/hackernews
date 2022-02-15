import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import classNames from 'classnames';
import { sortBy } from 'lodash';
import { connect } from 'react-redux';
import { addToCart, updateCart, deleteFromCart }  from './redux/actions/cart-actions';
import store from './redux/store.js';
let unsubscribe = store.subscribe(() =>
    console.log('unsubscribe123==>', store.getState())
);

const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'points').reverse(),
};
const list = [
    {
        title: 'React',
        url: 'https://facebook.github.io/react/',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 4,
        objectID: 0,
    },
    {
        title: 'React1',
        url: 'https://facebook.github.io/react/',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 4,
        objectID: 1,
    },
    {
        title: 'deact2',
        url: 'https://facebook.github.io/react/',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 4,
        objectID: 3,
    }
];
const DEFAULT_HPP = '100';
const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

function isSearched(searchTerm) {
    return function(item) {
        return item.title ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) : '';
    }
}
class Button extends Component {
    render() {
        const { onClick, className = '', children} = this.props;
        return (
            <button onClick={onClick} className={className} type="button">
                {children}
            </button>
        );
    }
}
// const Search = ({ value, onChange, children, onSubmit }) =>
//     <form onSubmit={onSubmit}>
//         <input type="text" value={value} onChange={onChange}/>
//         <button type="submit">
//             {children}
//         </button>
//     </form>
class Search extends Component {
    componentDidMount() {
        if(this.input) {
            this.input.focus();
        }
    }
    render() {
        const {
            value,
            onChange,
            onSubmit,
            children
        } = this.props;
        return (
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    ref={(node) => { this.input = node; }}
                />
                <button type="submit">
                    {children}
                </button>
            </form> );
    }
}

const Loading = () => <div>Loading ...</div>


// class Search extends Component {
//     constructor(prop) {
//         console.log('Search==>', prop)
//         super(prop);
//     }
//     render() {
//         const { value, onChange, children } = this.props;
//         return (
//             <form>
//                 {children}
//                 <input type="text" value={value} onChange={onChange}/>
//             </form>
//         );
//     }
// }

class Table extends Component {
    constructor(props) {
        console.log('table==>')
        super(props);
    }

    render() {

        const largeColumn = { width: '40%',
        };
        const midColumn = { width: '30%',
        };
        const smallColumn = { width: '10%',
        };
        const { list, onDismiss, sortKey, onSort, isSortReverse } = this.props;
        const sortedList = SORTS[sortKey](list);
        const reverseSortedList = isSortReverse
            ? sortedList.reverse()
            : sortedList;
        console.log('tableRender==>', list)
        let {shoppingCart: {cart: _content}} = store.getState()
        console.log('_content', _content)
        return (
            <div className="table">
                <div className="table-header">
                    {
                        Object.keys(SORTS).map(sortItem => {
                            return (
                                <span key={sortItem} style={{ width: '20%' }}>
                                    <Sort sortKey={sortItem} activeSortKey={sortKey} onSort={onSort}>{sortItem}</Sort>
                                </span>
                            )
                        })
                    }
                </div>


                {
                    _content.map(item =>
                    <div key={item.objectID} className="table-row">
                        <span style={largeColumn}>
                          <a href={item.url}>{item.product}</a>
                        </span>
                        <span style={midColumn}>{item.author}</span>
                        <span style={smallColumn}>{item.quantity}</span>
                        <span style={smallColumn}>{item.points}</span>
                        <span style={smallColumn}>
                            <Button onClick={() => onDismiss(item.objectID)}> Dismiss </Button>
                        </span>
                    </div>
                )}
            </div>
        );
    }
}


const Sort = ({ sortKey, onSort, children, activeSortKey }) => {
    const sortClass = classNames(
        'button-inline',
        { 'button-active': sortKey === activeSortKey }
    );

    return <Button className={sortClass} onClick={() => onSort(sortKey)}>{children}</Button>
}


const withLoading = (Component) => ({ isLoading, ...rest }) =>
    isLoading
        ? <Loading />
        : <Component { ...rest } />

const ButtonWithLoading = withLoading(Button);

class App extends Component {
    constructor(props) {
        super(props);
        let {shoppingCart: {cart}} = props;
        this.state = {
            list: [...cart],
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
            result: null,
            error: null,
            isLoading: false,
            sortKey: 'NONE',
            isSortReverse: false,
        };
        this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
        this.onClickMe = this.onClickMe.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.onSort = this.onSort.bind(this);
    }

    onSort(sortKey) {
        const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
        this.setState({ sortKey, isSortReverse });
        this.setState((prevState, props) => {
            console.log('setState==>', prevState, props)
        });
    }

    needsToSearchTopStories(searchTerm) {
        return !this.state.results[searchTerm];
    }

    onSearchSubmit(event) {
        console.log('onSearchSubmit==>')
        this.props.test()
        // const { searchTerm } = this.state;
        // this.setState({ searchKey: searchTerm });
        // if (this.needsToSearchTopStories(searchTerm)) {
        //     this.fetchSearchTopStories(searchTerm);
        // }
        event.preventDefault();
    }

    setSearchTopStories(result) {
        const { hits, page } = result;
        const { searchKey, results } = this.state;
        const oldHits = results && results[searchKey]
            ? results[searchKey].hits
            : [];
        const updatedHits = [
            ...oldHits,
            ...hits
        ];
        this.setState({
            results: {
                ...results,
                [searchKey]: { hits: updatedHits, page }
            },
            isLoading: false
        });
    }
    fetchSearchTopStories(searchTerm, page = 0) {
        this.setState({ isLoading: true });

        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(e => this.setState({ error: e }));
    }

    onClickMe() {
        console.log(this)
        return () => {
            console.log(this);
        }
    }
    onSearchChange(e) {
        console.log('onSearchChange==>', e.target.value)
        this.setState({
            searchTerm: e.target.value
        })
    }

    componentDidMount() {
        console.log('this.props==>', this.props)
        this.props.potential('test')
        // const { searchTerm } = this.state;
        // this.setState({ searchKey: searchTerm });
        // console.log('componentDidMount==>')
        // this.fetchSearchTopStories(searchTerm);
    }

    render() {
        console.log('appRender==>')
        const {
            searchTerm,
            results,
            list,
            searchKey,
            error,
            isLoading,
            sortKey,
            isSortReverse
        } = this.state;
        const page = (
            results &&
            results[searchKey] &&
            results[searchKey].page
        ) || 0;
        // const list = (
        //     results &&
        //     results[searchKey] &&
        //     results[searchKey].hits
        // ) || [];

        return (
            // <div className="App">
            //     <button onClick={this.onClickMe()} type="button">Click Me</button>
            //     {
            //         this.state.list.map(item => {
            //             return (
            //                     <div onClick={() => this.onDismiss(item)}>{item.title}</div>
            //             )
            //         })
            //     }
            //     <header className="App-header">
            //         <img src={logo} className="App-logo" alt="logo" />
            //         <p>
            //             E1dit <code>src/App.js</code> and save to reload.
            //         </p>
            //         <a className="App-link" target="_blank" rel="noopener noreferrer">Learn React</a>
            //     </header>
                <div className="page">
                    <div className="interactions">
                        <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
                            <div>gaolinxiong</div>
                        </Search>
                    </div>
                    {error
                        ? <div className="interactions">
                            <p>Something went wrong.</p>
                        </div> :
                        list && <Table list={list} isSortReverse={isSortReverse} sortKey={sortKey} onSort={this.onSort} pattern={searchTerm} onDismiss={this.onDismiss}/>
                    }
                    <div className="interactions">
                        <ButtonWithLoading isLoading={isLoading} onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
                            More
                        </ButtonWithLoading>
                    </div>
                </div>
        )
    }

    onDismiss(objectID) {
        const { searchKey, results } = this.state;
        const { hits, page } = results[searchKey];
        const isNotId = item => item.objectID !== objectID;
        const updatedHits = hits.filter(isNotId);
        this.setState({
            results: {
                ...results,
                [searchKey]: {hits: updatedHits, page}
            }
        })
    }
}
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default connect((state) => {
    //获取到仓库的state
    return state
}, (dispatch) => {
    //用dispatch触发仓库中的action
    return {
        potential(params) {
            console.log('potential==>', params)
            dispatch(addToCart('Coffee 500gm', 1, 250))
        },
        test() {
            dispatch(addToCart('Juice 2L', 1, 250));
        }
    }
})(App);

// export default ;
