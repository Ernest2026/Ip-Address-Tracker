import React, { useState, useRef } from "react";

function Header() {
  const [height, setHeight] = useState(0);
  const [display, setDisplay] = useState(false);
  const [data, setData] = useState("");
  const [ip, setIp] = useState("");
  const [latlng, setLatlng] = useState([0, 0]);
  const [loading, setLoading] = useState(false);
  const elementRef = useRef(null);

  const changeHeight = () => {
    setHeight(elementRef.current.clientHeight / 2);
  };

  const style = {
    marginTop: -height,
    display: `${display ? "flex" : "none"}`,
    transition: ".5s",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData("");
    setLoading(true);
    const value = await fetch(`http://ipwhois.app/json/${ip}`).then((val) =>
      val.json()
    );
    setLoading(false);

    setData(value);
    value.success
      ? setLatlng([value.latitude, value.longitude])
      : setLatlng([0, 0]);
    setDisplay(true);
    setTimeout(changeHeight, 1);
  };

  window.addEventListener("resize", changeHeight);

  return (
    <>
      <header>
        <div
          className="wrap-hd"
          style={{ marginBottom: `${height + 9}px`, transition: ".3s" }}
        >
          <h2 className="hd-name">IP Address Tracker</h2>
          <div className="hd-div">
            <form action="/" method="get" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Search for any IP address or domain"
                className="hd-input"
                id="input-ip"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                required
              />
              <span className={loading ? "loading" : ""}></span>
              <p className="error-msg">{data.message}</p>
              <button type="submit" className="hd-btn">
                <img src="./images/icon-arrow.svg" alt="Enter" />
              </button>
            </form>
          </div>
        </div>
        <div className="loc" id="loc" ref={elementRef} style={style}>
          <div className="item">
            <h4>IP Address</h4>
            <h2>{data.ip}</h2>
          </div>
          <div className="item">
            <h4>Location</h4>
            <h2>{data.city}</h2>
          </div>
          <div className="item">
            <h4>Timezone</h4>
            <h2>{data.timezone}</h2>
          </div>
          <div className="item">
            <h4>ISP</h4>
            <h2>{data.isp}</h2>
          </div>
        </div>
      </header>
      <input type="hidden" name="location" value={latlng} id="latlng" />
    </>
  );
}

export default Header;
