"use client";

import { useState } from "react";

interface FloorPlan {
  img: string;
  title: string;
  size: string;
  floor: string;
  price: string;
}

interface PriceDetail {
  type: string;
  size: string;
  price: string;
}

interface LocationAdvantage {
  title: string;
  value: string;
}

export default function ProjectForm({ initialData }: any) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    price: initialData?.price || "",
    img: initialData?.img || "",
    type: initialData?.type || "",

    brochure: initialData?.brochure || "",
    map: initialData?.map || "",

    shortDesc: initialData?.shortDesc || "",
    description: initialData?.description || "",

    location: initialData?.location || "",
    config: initialData?.config || "",

    rera: initialData?.rera || "",
    developer: initialData?.developer || "",
    possession: initialData?.possession || "",
    area: initialData?.area || "",

    roi: initialData?.roi || "",

    builderInfo: {
      name: initialData?.builderInfo?.name || "",
      experience: initialData?.builderInfo?.experience || "",
    },

    investment: {
      rental: initialData?.investment?.rental || "",

      appreciation: initialData?.investment?.appreciation || "",
    },

    amenities: initialData?.amenities?.map((item: any) => item.name) || [""],

    highlights: initialData?.highlights?.map((item: any) => item.text) || [""],

    nearby: initialData?.nearby?.map((item: any) => item.text) || [""],

    gallery: initialData?.gallery?.map((item: any) => item.image) || [""],

    priceDetails: initialData?.priceDetails || [
      {
        type: "",
        size: "",
        price: "",
      },
    ],

    floorPlans: initialData?.floorPlans || [
      {
        img: "",
        title: "",
        size: "",
        floor: "",
        price: "",
      },
    ],

    locationAdvantages: initialData?.locationAdvantages || [
      {
        title: "",
        value: "",
      },
    ],
  });

  // BASIC INPUT CHANGE
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // BUILDER INFO
  const handleBuilderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,

      builderInfo: {
        ...formData.builderInfo,
        [e.target.name]: e.target.value,
      },
    });
  };

  // INVESTMENT
  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,

      investment: {
        ...formData.investment,
        [e.target.name]: e.target.value,
      },
    });
  };

  // ARRAY STRING CHANGE
  const handleArrayChange = (
    field: "amenities" | "highlights" | "nearby" | "gallery",

    index: number,
    value: string,
  ) => {
    const updated = [...formData[field]];

    updated[index] = value;

    setFormData({
      ...formData,
      [field]: updated,
    });
  };

  // ADD STRING ARRAY FIELD
  const addArrayField = (
    field: "amenities" | "highlights" | "nearby" | "gallery",
  ) => {
    setFormData({
      ...formData,

      [field]: [...formData[field], ""],
    });
  };

  // PRICE DETAILS
  const handlePriceDetailChange = (
    index: number,
    key: keyof PriceDetail,
    value: string,
  ) => {
    const updated = [...formData.priceDetails];

    updated[index][key] = value;

    setFormData({
      ...formData,
      priceDetails: updated,
    });
  };

  const addPriceDetail = () => {
    setFormData({
      ...formData,

      priceDetails: [
        ...formData.priceDetails,

        {
          type: "",
          size: "",
          price: "",
        },
      ],
    });
  };

  // FLOOR PLANS
  const handleFloorPlanChange = (
    index: number,
    key: keyof FloorPlan,
    value: string,
  ) => {
    const updated = [...formData.floorPlans];

    updated[index][key] = value;

    setFormData({
      ...formData,
      floorPlans: updated,
    });
  };

  const addFloorPlan = () => {
    setFormData({
      ...formData,

      floorPlans: [
        ...formData.floorPlans,

        {
          img: "",
          title: "",
          size: "",
          floor: "",
          price: "",
        },
      ],
    });
  };

  // LOCATION ADVANTAGES
  const handleLocationAdvantageChange = (
    index: number,
    key: keyof LocationAdvantage,
    value: string,
  ) => {
    const updated = [...formData.locationAdvantages];

    updated[index][key] = value;

    setFormData({
      ...formData,
      locationAdvantages: updated,
    });
  };

  const addLocationAdvantage = () => {
    setFormData({
      ...formData,

      locationAdvantages: [
        ...formData.locationAdvantages,

        {
          title: "",
          value: "",
        },
      ],
    });
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = initialData ? "PUT" : "POST";

    const url = initialData
  ? `/api/projects/${initialData.slug}`
  : "/api/projects";
  
    const res = await fetch(url, {
      method,

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(formData),
    });

    let data = null;

    try {
      data = await res.json();
    } catch (error) {
      console.log("No JSON response");
    }

    console.log(data);

    if (!res.ok) {
      alert(data?.error || "Something went wrong");

      return;
    }

    alert(initialData ? "Project Updated" : "Project Created");
  };

  const uploadFile = async (file: File) => {
    const uploadData = new FormData();

    uploadData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: uploadData,
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    const data = await res.json();

    return data.url;
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    index?: number,
  ) => {
    try {
      const file = e.target.files?.[0];

      if (!file) return;

      const url = await uploadFile(file);

      // SINGLE FIELD
      if (field === "img" || field === "brochure") {
        setFormData((prev: any) => ({
          ...prev,
          [field]: url,
        }));

        return;
      }

      // FLOOR PLANS
      if (field === "floorPlans" && index !== undefined) {
        setFormData((prev: any) => {
          const updated = [...prev.floorPlans];

          updated[index].img = url;

          return {
            ...prev,
            floorPlans: updated,
          };
        });

        return;
      }

      // GALLERY
      if (field === "gallery" && index !== undefined) {
        setFormData((prev: any) => {
          const updated = [...prev.gallery];

          updated[index] = url;

          return {
            ...prev,
            gallery: updated,
          };
        });
      }
    } catch (error) {
      console.log(error);
      alert("Upload failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto p-10 grid gap-10"
    >
      {/* BASIC INFO */}

      <div className="grid gap-4">
        <h2 className="text-3xl font-bold">Basic Info</h2>

        <input
          name="name"
          placeholder="Project Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <div className="grid gap-2">
          <label className="font-semibold">Thumbnail Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "img")}
            className="border p-3 rounded-lg"
          />

          {formData.img && (
            <img
              src={formData.img}
              alt="Preview"
              className="w-40 rounded-lg border"
            />
          )}
        </div>

        <input
          name="type"
          placeholder="Type"
          value={formData.type}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="config"
          placeholder="Configuration"
          value={formData.config}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
      </div>

      {/* DESCRIPTION */}

      <div className="grid gap-4">
        <h2 className="text-3xl font-bold">Description</h2>

        <textarea
          name="shortDesc"
          placeholder="Short Description"
          value={formData.shortDesc}
          onChange={handleChange}
          className="border p-3 rounded-lg min-h-25"
        />

        <textarea
          name="description"
          placeholder="Full Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-3 rounded-lg min-h-50"
        />
      </div>

      {/* BUILDER INFO */}

      <div className="grid gap-4">
        <h2 className="text-3xl font-bold">Builder Info</h2>

        <input
          name="name"
          placeholder="Builder Name"
          value={formData.builderInfo.name}
          onChange={handleBuilderChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="experience"
          placeholder="Experience"
          value={formData.builderInfo.experience}
          onChange={handleBuilderChange}
          className="border p-3 rounded-lg"
        />
      </div>

      {/* PROJECT DETAILS */}

      <div className="grid gap-4">
        <h2 className="text-3xl font-bold">Project Details</h2>

        <input
          name="developer"
          placeholder="Developer"
          value={formData.developer}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="rera"
          placeholder="RERA"
          value={formData.rera}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="possession"
          placeholder="Possession"
          value={formData.possession}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="area"
          placeholder="Area"
          value={formData.area}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="roi"
          placeholder="ROI"
          value={formData.roi}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <div className="grid gap-2">
          <label className="font-semibold">Upload Brochure</label>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileUpload(e, "brochure")}
            className="border p-3 rounded-lg"
          />

          {formData.brochure && (
            <a
              href={formData.brochure}
              target="_blank"
              className="text-blue-600 underline"
            >
              View Uploaded Brochure
            </a>
          )}
        </div>

        <input
          name="map"
          placeholder="Google Map Embed URL"
          value={formData.map}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
      </div>

      {/* INVESTMENT */}

      <div className="grid gap-4">
        <h2 className="text-3xl font-bold">Investment</h2>

        <input
          name="rental"
          placeholder="Rental Income"
          value={formData.investment.rental}
          onChange={handleInvestmentChange}
          className="border p-3 rounded-lg"
        />

        <input
          name="appreciation"
          placeholder="Appreciation"
          value={formData.investment.appreciation}
          onChange={handleInvestmentChange}
          className="border p-3 rounded-lg"
        />
      </div>

      {/* AMENITIES */}

      <DynamicStringSection
        title="Amenities"
        field="amenities"
        data={formData.amenities}
        addField={addArrayField}
        handleChange={handleArrayChange}
      />

      {/* HIGHLIGHTS */}

      <DynamicStringSection
        title="Highlights"
        field="highlights"
        data={formData.highlights}
        addField={addArrayField}
        handleChange={handleArrayChange}
      />

      {/* NEARBY */}

      <DynamicStringSection
        title="Nearby"
        field="nearby"
        data={formData.nearby}
        addField={addArrayField}
        handleChange={handleArrayChange}
      />

      {/* GALLERY */}

      <div className="grid gap-5">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">Gallery</h2>

          <button
            type="button"
            onClick={() => addArrayField("gallery")}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Add
          </button>
        </div>

        {formData.gallery.map((item: string, index: number) => (
          <div key={index} className="grid gap-3 border p-4 rounded-xl">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "gallery", index)}
              className="border p-3 rounded-lg"
            />

            {item && (
              <img
                src={item}
                alt="Gallery"
                className="w-52 rounded-lg border"
              />
            )}
          </div>
        ))}
      </div>

      {/* PRICE DETAILS */}

      <div className="grid gap-5">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">Price Details</h2>

          <button
            type="button"
            onClick={addPriceDetail}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Add
          </button>
        </div>

        {formData.priceDetails.map((item: PriceDetail, index: number) => (
          <div key={index} className="grid grid-cols-3 gap-4">
            <input
              placeholder="Type"
              value={item.type}
              onChange={(e) =>
                handlePriceDetailChange(index, "type", e.target.value)
              }
              className="border p-3 rounded-lg"
            />

            <input
              placeholder="Size"
              value={item.size}
              onChange={(e) =>
                handlePriceDetailChange(index, "size", e.target.value)
              }
              className="border p-3 rounded-lg"
            />

            <input
              placeholder="Price"
              value={item.price}
              onChange={(e) =>
                handlePriceDetailChange(index, "price", e.target.value)
              }
              className="border p-3 rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* FLOOR PLANS */}

      <div className="grid gap-5">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">Floor Plans</h2>

          <button
            type="button"
            onClick={addFloorPlan}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Add
          </button>
        </div>

        {formData.floorPlans.map((item: FloorPlan, index: number) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-4 border p-4 rounded-xl"
          >
            {/* IMAGE UPLOAD */}

            <div className="col-span-2 grid gap-2">
              <label className="font-semibold">Floor Plan Image</label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "floorPlans", index)}
                className="border p-3 rounded-lg"
              />

              {item.img && (
                <img
                  src={item.img}
                  alt="Floor Plan"
                  className="w-52 rounded-lg border"
                />
              )}
            </div>

            {/* TITLE */}

            <input
              placeholder="Title"
              value={item.title}
              onChange={(e) =>
                handleFloorPlanChange(index, "title", e.target.value)
              }
              className="border p-3 rounded-lg"
            />

            {/* SIZE */}

            <input
              placeholder="Size"
              value={item.size}
              onChange={(e) =>
                handleFloorPlanChange(index, "size", e.target.value)
              }
              className="border p-3 rounded-lg"
            />

            {/* FLOOR */}

            <input
              placeholder="Floor"
              value={item.floor}
              onChange={(e) =>
                handleFloorPlanChange(index, "floor", e.target.value)
              }
              className="border p-3 rounded-lg"
            />

            {/* PRICE */}

            <input
              placeholder="Price"
              value={item.price}
              onChange={(e) =>
                handleFloorPlanChange(index, "price", e.target.value)
              }
              className="border p-3 rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* LOCATION ADVANTAGES */}

      <div className="grid gap-5">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold">Location Advantages</h2>

          <button
            type="button"
            onClick={addLocationAdvantage}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Add
          </button>
        </div>

        {formData.locationAdvantages.map(
          (item: LocationAdvantage, index: number) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <input
                placeholder="Title"
                value={item.title}
                onChange={(e) =>
                  handleLocationAdvantageChange(index, "title", e.target.value)
                }
                className="border p-3 rounded-lg"
              />

              <input
                placeholder="Value"
                value={item.value}
                onChange={(e) =>
                  handleLocationAdvantageChange(index, "value", e.target.value)
                }
                className="border p-3 rounded-lg"
              />
            </div>
          ),
        )}
      </div>

      <button className="bg-black text-white p-4 rounded-xl text-lg">
        {initialData ? "Update Project" : "Create Project"}
      </button>
    </form>
  );
}

interface DynamicStringSectionProps {
  title: string;

  field: "amenities" | "highlights" | "nearby" | "gallery";

  data: string[];

  addField: (field: "amenities" | "highlights" | "nearby" | "gallery") => void;

  handleChange: (
    field: "amenities" | "highlights" | "nearby" | "gallery",

    index: number,
    value: string,
  ) => void;
}

function DynamicStringSection({
  title,
  field,
  data,
  addField,
  handleChange,
}: DynamicStringSectionProps) {
  return (
    <div className="grid gap-5">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold">{title}</h2>

        <button
          type="button"
          onClick={() => addField(field)}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Add
        </button>
      </div>

      {data.map((item: string, index: number) => (
        <input
          key={index}
          value={item}
          onChange={(e) => handleChange(field, index, e.target.value)}
          className="border p-3 rounded-lg"
        />
      ))}
    </div>
  );
}
