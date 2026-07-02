import { useEffect, useState } from "react";

export default function ContentsPage() {

  const [pages, setPages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [pageTitle, setPageTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {

    fetch("http://localhost:5005/api/admin/contents")
      .then(res => res.json())
      .then(data => {
        setPages(data);
      });

  }, []);

  const loadPage = async (id) => {

    const res =
      await fetch(
        `http://localhost:5005/api/admin/contents/${id}`
      );

    const data =
      await res.json();

    setSelectedId(id);

    setPageTitle(
      data.page_title || ""
    );

    setContent(
      data.content || ""
    );

  };

  const savePage = async () => {

    if (!selectedId) return;

    await fetch(
      `http://localhost:5005/api/admin/contents/${selectedId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          page_title: pageTitle,
          content: content
        })
      }
    );

    alert("Content Updated Successfully");

  };

  return (

    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px"
      }}
    >

      {/* LEFT PANEL */}

      <div
        style={{
          width: "250px",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          padding: "15px",
          background: "rgba(18, 24, 20, 0.4)",
          color: "#eff6eb"
        }}
      >

        <h3 style={{ color: "#d7b56d", marginTop: 0, marginBottom: "15px" }}>Pages</h3>

        {
          pages.map((page) => (

            <div
              key={page.id}
              onClick={() => loadPage(page.id)}
              style={{
                padding: "10px 12px",
                marginBottom: "8px",
                cursor: "pointer",
                background: selectedId === page.id ? "rgba(215, 181, 109, 0.15)" : "#0f1d13",
                color: "#eff6eb",
                borderRadius: "8px",
                border: selectedId === page.id ? "1px solid #d7b56d" : "1px solid rgba(255,255,255,0.08)",
                transition: "0.2s"
              }}
            >

              {page.page_title}

            </div>

          ))
        }

      </div>

      {/* RIGHT PANEL */}

      <div style={{ flex: 1, color: "#eff6eb" }}>

        <h3 style={{ color: "#d7b56d", marginTop: 0, marginBottom: "15px" }}>Edit Content</h3>

        <input
          value={pageTitle}
          onChange={(e) =>
            setPageTitle(e.target.value)
          }
          placeholder="Page Title"
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: "12px",
            background: "#0f1d13",
            color: "#eff6eb",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px",
            outline: "none"
          }}
        />

        <textarea
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          rows="15"
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "#0f1d13",
            color: "#eff6eb",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "8px",
            outline: "none",
            resize: "vertical"
          }}
        />

        <br />
        <br />

        <button 
          onClick={savePage}
          style={{
            background: "linear-gradient(135deg, #d7b56d 0%, #b8954b 100%)",
            color: "#08120b",
            fontWeight: "600",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Save Content
        </button>

      </div>

    </div>

  );

}