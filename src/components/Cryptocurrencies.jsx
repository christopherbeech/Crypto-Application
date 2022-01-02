import React from 'react';
import { useState, useEffect } from 'react';
import millify from 'millify';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Input } from 'antd';
import { useGetCryptosQuery } from '../services/cryptoApi';
import Loader from './Loader';

export default function Cryptocurrencies( { simplified }) {
    const count = simplified ? 10 : 100;
    const { data: cryptosList, isFetching } = useGetCryptosQuery(count);
    const [cryptos, setCryptos] = useState(cryptosList?.data?.coins);
    const [searchTerm, setSearchTerm] = useState('');
    
    // console.log(cryptos)

    // filter for search input
    useEffect(() => {

        const filteredData = cryptosList?.data?.coins.filter((coin) => coin.name.toLowerCase().includes(searchTerm.toLowerCase()));

        setCryptos(filteredData);
    }, [cryptosList, searchTerm])


    if(isFetching) return <Loader />;

    return (
        <>
            {!simplified && (
                <div className='search-crypto'>
                    <Input type="text" placeholder="Search Cryptocurrency..." onChange={(e) => setSearchTerm(e.target.value.trim())}/>
                </div>
            )}

            {/* search inputfield to search for cryptos by name */}
            <Row gutter={[32, 32]} className="crypto-card-container">
                {cryptos?.map((currency) => (
                    //In ant design xs is for how small the col will be on small devices
                    // sm for small devices, lg for large devices
                    //remember when you iterate/loop oversomething, the parent needs a key prop
                    <Col xs={24} sm={12} lg={6}  className="crypto-card" key={currency.id}>
                        <Link to={`/crypto/${currency.id}`}>
                            <Card title={`${currency.rank}. ${currency.name}`} 
                                    extra={<img className="crypto-image" src={currency.iconUrl} />} 
                                    hoverable>
                                        
                                    <p>Price: ${currency.price}</p>
                                    <p>Market Cap: {millify(currency.marketCap)}</p>
                                    <p>Daily Change: {millify(currency.change)}%</p>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </>
    )
}
