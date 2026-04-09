import { useMemo, useState } from "react";

export default function AidGoPrototype() {
  const [page, setPage] = useState("home");
  const [notification, setNotification] = useState("");

  const [aidRequest, setAidRequest] = useState({
    name: "",
    location: "",
    people: 1,
    urgency: "Critical",
    aidTypes: ["Food & Water"],
    note: "",
  });

  const [volunteer, setVolunteer] = useState({
    name: "",
    phone: "",
    email: "",
    skills: ["Medical / First Aid"],
    availability: "Weekdays",
    experience: "",
  });

  const [donation, setDonation] = useState({
    amount: 500,
    name: "",
    method: "Bkash",
    submitted: false,
  });

  const [requestId, setRequestId] = useState("AG-20451");
  const [volunteerFilter, setVolunteerFilter] = useState("All");
  const [requestFilter, setRequestFilter] = useState("All");
  const [selectedRequestId, setSelectedRequestId] = useState("AG-20451");

  const quickActions = [
    { icon: "🫶", title: "Request Aid", subtitle: "Aid", page: "aid", tone: "primary" },
    { icon: "🤝", title: "Volunteer", subtitle: "Help", page: "volunteer", tone: "secondary" },
    { icon: "📋", title: "Volunteer List", subtitle: "List", page: "volunteerList", tone: "neutral" },
    { icon: "📦", title: "Resources", subtitle: "Support", page: "resources", tone: "secondary" },
    { icon: "👥", title: "Team Assign", subtitle: "Assign", page: "requests", tone: "primary" },
    { icon: "✅", title: "Tasks", subtitle: "Manage", page: "tasks", tone: "neutral" },
    { icon: "🏠", title: "Shelters", subtitle: "Nearby", page: "shelters", tone: "neutral" },
    { icon: "💸", title: "Donations", subtitle: "Support", page: "donate", tone: "secondary" },
  ];

  const [volunteerPool, setVolunteerPool] = useState([
    { id: 1, name: "Rahim Ahmed", skill: "Medical / First Aid", area: "District A", status: "Free", phone: "+8801711000001" },
    { id: 2, name: "Nila Sultana", skill: "Food Distribution", area: "District B", status: "Busy", phone: "+8801711000002" },
    { id: 3, name: "Karim Hasan", skill: "Search & Rescue", area: "District A", status: "Free", phone: "+8801711000003" },
    { id: 4, name: "Farzana Noor", skill: "Transportation", area: "District C", status: "Free", phone: "+8801711000004" },
    { id: 5, name: "Sabbir Khan", skill: "Medical / First Aid", area: "District B", status: "Busy", phone: "+8801711000005" },
    { id: 6, name: "Jui Akter", skill: "Food Distribution", area: "District A", status: "Free", phone: "+8801711000006" },
  ]);

  const [incomingRequests, setIncomingRequests] = useState([
    { id: "AG-20451", requester: "Mina Begum", type: "Medical", urgency: "Critical", location: "District A", people: 3, status: "Pending", assignedVolunteerId: null },
    { id: "AG-20452", requester: "Abdul Karim", type: "Food & Water", urgency: "High", location: "District B", people: 5, status: "Pending", assignedVolunteerId: null },
    { id: "AG-20453", requester: "Rafiq Mia", type: "Shelter", urgency: "Medium", location: "District C", people: 2, status: "Pending", assignedVolunteerId: null },
    { id: "AG-20454", requester: "Salma Aktar", type: "Rescue", urgency: "Critical", location: "District A", people: 4, status: "Team Assigned", assignedVolunteerId: 3 },
  ]);

  const shelters = [
    { name: "Community Center East", capacity: 200, occupied: 145, address: "123 Main St, District A" },
    { name: "School Gymnasium", capacity: 150, occupied: 150, address: "456 Oak Ave, District B" },
    { name: "Sports Complex", capacity: 300, occupied: 87, address: "789 Park Rd, District C" },
  ];

  const resources = [
    { name: "Water Bottles (500ml)", location: "Warehouse A", qty: 1500, unit: "Unit", status: "Available" },
    { name: "Emergency Food Rations", location: "Warehouse A", qty: 800, unit: "Unit", status: "Available" },
    { name: "First Aid Kits", location: "Medical Center", qty: 210, unit: "Unit", status: "Available" },
    { name: "Blankets", location: "Warehouse B", qty: 450, unit: "Unit", status: "Available" },
    { name: "Tents (4-person)", location: "Storage Unit 1", qty: 50, unit: "Unit", status: "Low Stock" },
    { name: "Flashlights", location: "Warehouse B", qty: 200, unit: "Unit", status: "Available" },
  ];

  const totalRaised = useMemo(() => 35550 + (donation.submitted ? Number(donation.amount || 0) : 0), [donation.amount, donation.submitted]);

  const filteredVolunteers = useMemo(() => {
    if (volunteerFilter === "All") return volunteerPool;
    if (volunteerFilter === "Free" || volunteerFilter === "Busy") return volunteerPool.filter((v) => v.status === volunteerFilter);
    return volunteerPool.filter((v) => v.skill === volunteerFilter);
  }, [volunteerFilter, volunteerPool]);

  const filteredRequests = useMemo(() => {
    if (requestFilter === "All") return incomingRequests;
    return incomingRequests.filter((r) => r.urgency === requestFilter || r.type === requestFilter || r.status === requestFilter);
  }, [requestFilter, incomingRequests]);

  const selectedRequest = useMemo(
    () => incomingRequests.find((r) => r.id === selectedRequestId) || incomingRequests[0],
    [incomingRequests, selectedRequestId]
  );

  const matchingVolunteers = useMemo(() => {
    if (!selectedRequest) return [];
    const skillMap = {
      Medical: "Medical / First Aid",
      "Food & Water": "Food Distribution",
      Rescue: "Search & Rescue",
      Shelter: "Transportation",
    };
    const neededSkill = skillMap[selectedRequest.type] || "Transportation";
    return volunteerPool.filter((v) => v.status === "Free" && v.skill === neededSkill);
  }, [selectedRequest, volunteerPool]);

  const showToast = (msg) => {
    setNotification(msg);
    window.clearTimeout(window.__aidGoToast);
    window.__aidGoToast = window.setTimeout(() => setNotification(""), 2500);
  };

  const Header = ({ title, subtitle, back = false }) => (
    <div className="bg-[#E9333A] px-4 py-4 flex items-center gap-3 text-white shadow-[0_12px_32px_rgba(233,51,58,0.22)]">
      {back && (
        <button onClick={() => setPage("home")} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-lg">
          ←
        </button>
      )}
      <div>
        <h1 className="text-[20px] font-bold leading-none">{title}</h1>
        {subtitle ? <p className="text-[11px] text-white/90 mt-1">{subtitle}</p> : null}
      </div>
    </div>
  );

  const Screen = ({ children }) => <div className="bg-[#F5F7FA] min-h-[844px]">{children}</div>;

  const Panel = ({ children, className = "" }) => (
    <section className={`bg-white rounded-[20px] border border-[#E2E8F0] shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-4 ${className}`}>
      {children}
    </section>
  );

  const Input = ({ label, placeholder, value, onChange, type = "text" }) => (
    <div className="space-y-1.5">
      <label className="text-[14px] text-[#0F172A] font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14px] outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
      />
    </div>
  );

  const HomePage = () => (
    <Screen>
      <Header title="Aid Go" subtitle="Emergency response prototype" />
      <div className="px-3 pt-4 pb-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[18px] border border-[#D6DEE8] bg-white p-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <div className="text-[28px] font-bold text-[#0F172A] leading-none">12</div>
            <div className="text-[12px] text-[#3B82F6] mt-2">Live Requests</div>
          </div>
          <div className="rounded-[18px] border border-[#D6DEE8] bg-white p-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <div className="text-[28px] font-bold text-[#0F172A] leading-none">8</div>
            <div className="text-[12px] text-[#3B82F6] mt-2">Active Volunteers</div>
          </div>
        </div>

        <Panel>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-[18px] font-semibold text-[#0F172A]">Emergency Overview</h2>
            <div className="bg-[#FEE2E2] text-[#EF4444] rounded-full px-3 py-1 text-[12px] font-medium">Live</div>
          </div>
          <p className="text-[14px] text-[#64748B] mb-4">Today's response status</p>
          <div className="h-[138px] rounded-2xl border border-[#DDE5EF] bg-[linear-gradient(135deg,#eef2f7,#e2e8f0)] relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 opacity-60">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                <path d="M0 150 C80 120, 120 160, 200 130 S320 90, 400 120" fill="none" stroke="#cbd5e1" strokeWidth="4" />
                <path d="M50 20 C120 60, 170 40, 240 70 S320 110, 380 80" fill="none" stroke="#dbe3ec" strokeWidth="3" />
                <path d="M120 0 L140 200" stroke="#e5edf5" strokeWidth="2" />
                <path d="M250 0 L230 200" stroke="#e5edf5" strokeWidth="2" />
              </svg>
            </div>
            <div className="absolute left-10 top-10 w-3.5 h-3.5 rounded-full bg-[#F43F5E] ring-4 ring-rose-100" />
            <div className="absolute right-16 top-12 w-3.5 h-3.5 rounded-full bg-[#F59E0B] ring-4 ring-amber-100" />
            <div className="absolute left-1/2 bottom-8 w-3.5 h-3.5 rounded-full bg-[#22C55E] ring-4 ring-emerald-100" />
            <div className="absolute left-4 bottom-4 bg-white border border-[#D6DEE8] rounded-full px-3 py-1 text-[12px] text-[#475569] shadow-sm">Updated 2 mins ago</div>
          </div>
        </Panel>

        <Panel>
          <h2 className="text-[18px] font-semibold text-[#0F172A] mb-1">Main Features</h2>
          <p className="text-[14px] text-[#64748B] mb-4">Tap to preview the final prototype screens</p>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const toneClass = action.tone === "primary"
                ? "bg-[#FFF5F5] border-[#FECACA]"
                : action.tone === "secondary"
                ? "bg-[#F8FAFC] border-[#CBD5E1]"
                : "bg-white border-[#E2E8F0]";
              return (
                <button
                  key={action.title}
                  onClick={() => setPage(action.page)}
                  className={`min-h-[96px] rounded-[18px] border px-2 py-3 text-center flex flex-col items-center justify-center shadow-sm hover:shadow-md transition ${toneClass}`}
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <div className="text-[13px] leading-[16px] font-medium text-[#0F172A]">{action.title}</div>
                  <div className="text-[12px] text-[#64748B] mt-1">{action.subtitle}</div>
                </button>
              );
            })}
          </div>
        </Panel>

        <button onClick={() => setPage("aid")} className="w-full rounded-[18px] bg-[#E9333A] text-white py-4 text-[18px] font-semibold shadow-[0_14px_30px_rgba(233,51,58,0.24)]">Start Main Flow</button>
      </div>
    </Screen>
  );

  const AidPage = () => {
    const toggleAidType = (type) => {
      setAidRequest((prev) => ({
        ...prev,
        aidTypes: prev.aidTypes.includes(type)
          ? prev.aidTypes.filter((t) => t !== type)
          : [...prev.aidTypes, type],
      }));
    };

    return (
      <Screen>
        <Header title="Request Aid" subtitle="Main feature of the system" back />
        <div className="p-4">
          <Panel className="space-y-4">
            <Input label="Full Name" placeholder="Enter your name" value={aidRequest.name} onChange={(e) => setAidRequest({ ...aidRequest, name: e.target.value })} />
            <Input label="Current Location" placeholder="Village / area / address" value={aidRequest.location} onChange={(e) => setAidRequest({ ...aidRequest, location: e.target.value })} />

            <div>
              <label className="text-[14px] text-[#0F172A] font-medium block mb-2">Number of People Affected</label>
              <div className="grid grid-cols-[56px_1fr_56px] gap-3">
                <button onClick={() => setAidRequest({ ...aidRequest, people: Math.max(1, aidRequest.people - 1) })} className="rounded-xl border border-[#CBD5E1] bg-white text-xl font-bold text-[#0F172A] shadow-sm">−</button>
                <div className="rounded-xl border border-[#CBD5E1] bg-[#EEF2F7] py-3 text-center text-[30px] font-semibold leading-none text-[#0F172A] shadow-inner">{aidRequest.people}</div>
                <button onClick={() => setAidRequest({ ...aidRequest, people: aidRequest.people + 1 })} className="rounded-xl border border-[#CBD5E1] bg-white text-xl font-bold text-[#0F172A] shadow-sm">+</button>
              </div>
            </div>

            <div>
              <label className="text-[14px] text-[#0F172A] font-medium block mb-2">Urgency Level</label>
              <div className="grid grid-cols-3 gap-3">
                {['Critical', 'High', 'Medium'].map((level) => (
                  <button key={level} onClick={() => setAidRequest({ ...aidRequest, urgency: level })} className={`rounded-xl py-3 border shadow-sm ${aidRequest.urgency === level ? 'bg-[#E9333A] text-white border-[#E9333A]' : 'bg-white text-[#334155] border-[#CBD5E1]'}`}>
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[14px] text-[#0F172A] font-medium block mb-2">Type of Aid Needed</label>
              <div className="grid grid-cols-2 gap-3 text-[14px]">
                {['Food & Water', 'Medical', 'Shelter', 'Rescue'].map((type) => {
                  const active = aidRequest.aidTypes.includes(type);
                  return (
                    <button key={type} onClick={() => toggleAidType(type)} className={`rounded-xl border px-3 py-3 text-left shadow-sm ${active ? 'bg-[#FFF5F5] border-[#FECACA] text-[#DC2626]' : 'bg-white border-[#CBD5E1] text-[#334155]'}`}>
                      {active ? '☑' : '☐'} {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] text-[#0F172A] font-medium">Additional Note</label>
              <textarea rows={4} value={aidRequest.note} onChange={(e) => setAidRequest({ ...aidRequest, note: e.target.value })} placeholder="Describe the situation briefly" className="w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14px] outline-none text-[#0F172A] placeholder:text-[#94A3B8]" />
            </div>

            <button
              onClick={() => {
                const newId = `AG-${Math.floor(10000 + Math.random() * 89999)}`;
                setRequestId(newId);
                setIncomingRequests((prev) => [
                  { id: newId, requester: aidRequest.name || 'New Request', type: aidRequest.aidTypes[0] || 'Food & Water', urgency: aidRequest.urgency, location: aidRequest.location || 'Unknown', people: aidRequest.people, status: 'Pending', assignedVolunteerId: null },
                  ...prev,
                ]);
                setSelectedRequestId(newId);
                setPage('aidSuccess');
                showToast('Aid request submitted successfully');
              }}
              className="w-full bg-[#E9333A] text-white py-3.5 rounded-xl font-semibold shadow-[0_10px_24px_rgba(233,51,58,0.22)]"
            >
              Submit Request
            </button>
          </Panel>
        </div>
      </Screen>
    );
  };

  const AidSuccessPage = () => (
    <Screen>
      <Header title="Request Submitted" subtitle="Aid request completed" back />
      <div className="p-4">
        <Panel className="text-center py-8">
          <div className="w-20 h-20 rounded-full bg-[#E8F5E9] text-4xl flex items-center justify-center mx-auto mb-4 shadow-sm">✅</div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Request Submitted</h2>
          <p className="text-[#64748B] mt-2">Your request has been received.</p>
          <div className="mt-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 text-left space-y-2 text-sm shadow-inner">
            <div className="flex items-center justify-between"><span className="text-[#64748B]">Request ID</span><span className="font-semibold text-[#0F172A]">{requestId}</span></div>
            <div className="flex items-center justify-between"><span className="text-[#64748B]">Status</span><span className="font-semibold text-[#DC2626]">Pending</span></div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button onClick={() => setPage('requests')} className="rounded-xl bg-[#1E293B] text-white py-3 font-semibold shadow-sm">Assign Team</button>
            <button onClick={() => setPage('home')} className="rounded-xl border border-[#CBD5E1] bg-white py-3 font-semibold text-[#334155] shadow-sm">Back Home</button>
          </div>
        </Panel>
      </div>
    </Screen>
  );

  const VolunteerPage = () => {
    const toggleSkill = (skill) => {
      setVolunteer((prev) => ({
        ...prev,
        skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
      }));
    };

    return (
      <Screen>
        <Header title="Volunteer Registration" subtitle="Join as a helper" back />
        <div className="p-4">
          <Panel className="space-y-4">
            <Input label="Full Name" placeholder="Enter your name" value={volunteer.name} onChange={(e) => setVolunteer({ ...volunteer, name: e.target.value })} />
            <Input label="Phone" placeholder="+8801XXXXXXXXX" value={volunteer.phone} onChange={(e) => setVolunteer({ ...volunteer, phone: e.target.value })} />
            <Input label="Email" placeholder="email@example.com" value={volunteer.email} onChange={(e) => setVolunteer({ ...volunteer, email: e.target.value })} />

            <div>
              <label className="text-[14px] text-[#0F172A] font-medium block mb-2">Skills</label>
              <div className="space-y-2 text-[14px]">
                {['Medical / First Aid', 'Food Distribution', 'Search & Rescue', 'Transportation'].map((skill) => {
                  const active = volunteer.skills.includes(skill);
                  return (
                    <button key={skill} onClick={() => toggleSkill(skill)} className={`w-full rounded-xl border px-3 py-3 text-left shadow-sm ${active ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]' : 'bg-white border-[#CBD5E1] text-[#334155]'}`}>
                      {active ? '☑' : '☐'} {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-[14px] text-[#0F172A] font-medium block mb-2">Availability</label>
              <div className="grid grid-cols-3 gap-3">
                {['Weekdays', 'Weekend', 'Anytime'].map((slot) => (
                  <button key={slot} onClick={() => setVolunteer({ ...volunteer, availability: slot })} className={`rounded-xl py-3 border shadow-sm ${volunteer.availability === slot ? 'bg-[#3B82F6] text-white border-[#3B82F6]' : 'bg-white text-[#334155] border-[#CBD5E1]'}`}>
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] text-[#0F172A] font-medium">Experience</label>
              <textarea rows={4} value={volunteer.experience} onChange={(e) => setVolunteer({ ...volunteer, experience: e.target.value })} placeholder="Briefly describe any previous experience" className="w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[14px] outline-none text-[#0F172A] placeholder:text-[#94A3B8]" />
            </div>

            <button
              onClick={() => {
                setVolunteerPool((prev) => [
                  { id: Date.now(), name: volunteer.name || 'New Volunteer', skill: volunteer.skills[0] || 'General', area: 'District A', status: 'Free', phone: volunteer.phone || '+8801XXXXXXXXX' },
                  ...prev,
                ]);
                setPage('volunteerSuccess');
                showToast('Volunteer registration completed');
              }}
              className="w-full bg-[#E9333A] text-white py-3.5 rounded-xl font-semibold shadow-[0_10px_24px_rgba(233,51,58,0.22)]"
            >
              Register as Volunteer
            </button>
          </Panel>
        </div>
      </Screen>
    );
  };


  const VolunteerSuccessPage = () => (
    <Screen>
      <Header title="Volunteer Confirmed" subtitle="Registration successful" back />
      <div className="p-4">
        <Panel className="text-center py-8">
          <div className="w-20 h-20 rounded-full bg-[#E8F5E9] text-4xl flex items-center justify-center mx-auto mb-4 shadow-sm">🤝</div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Welcome, Volunteer!</h2>
          <p className="text-[#64748B] mt-2">You have successfully joined the network.</p>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button onClick={() => setPage('volunteerList')} className="rounded-xl bg-[#1E293B] text-white py-3 font-semibold shadow-sm">Volunteer List</button>
            <button onClick={() => setPage('home')} className="rounded-xl border border-[#CBD5E1] bg-white py-3 font-semibold text-[#334155] shadow-sm">Back Home</button>
          </div>
        </Panel>
      </div>
    </Screen>
  );

  const VolunteerListPage = () => {
    const filterOptions = ["All", "Free", "Busy", "Medical / First Aid", "Food Distribution", "Search & Rescue", "Transportation"];
    return (
      <Screen>
        <Header title="Volunteer List" subtitle="Availability and skill overview" back />
        <div className="p-4 space-y-4">
          <Panel className="space-y-3">
            <input placeholder="Search volunteer..." className="w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 outline-none text-[#0F172A] placeholder:text-[#94A3B8]" />
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filterOptions.map((item) => (
                <button key={item} onClick={() => setVolunteerFilter(item)} className={`whitespace-nowrap rounded-full px-3 py-2 text-sm border shadow-sm ${volunteerFilter === item ? 'bg-[#1E293B] text-white border-[#1E293B]' : 'bg-white text-[#334155] border-[#CBD5E1]'}`}>
                  {item}
                </button>
              ))}
            </div>
          </Panel>
          {filteredVolunteers.map((item) => (
            <Panel key={item.id}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-semibold text-[#0F172A]">{item.name}</h3>
                  <p className="text-sm text-[#64748B]">{item.skill}</p>
                </div>
                <span className={`text-xs rounded-full px-3 py-1 border shadow-sm ${item.status === 'Free' ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]' : 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'}`}>{item.status}</span>
              </div>
              <div className="text-sm text-[#475569] space-y-1">
                <p>Area: {item.area}</p>
                <p>Phone: {item.phone}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button className="rounded-xl border border-[#CBD5E1] py-3 bg-white text-[#334155] shadow-sm">View Details</button>
                <button onClick={() => { if (item.status === 'Free') { setSelectedRequestId(incomingRequests[0]?.id || 'AG-20451'); setPage('assign'); } }} className={`rounded-xl py-3 shadow-sm ${item.status === 'Free' ? 'bg-[#E9333A] text-white' : 'bg-[#E2E8F0] text-[#94A3B8]'}`}>
                  Assign
                </button>
              </div>
            </Panel>
          ))}
        </div>
      </Screen>
    );
  };

  const RequestsPage = () => {
    const filterOptions = ["All", "Critical", "High", "Medium", "Medical", "Food & Water", "Shelter", "Rescue", "Pending", "Team Assigned"];
    return (
      <Screen>
        <Header title="Team Assign" subtitle="Filter and assign response team" back />
        <div className="p-4 space-y-4">
          <Panel className="space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filterOptions.map((item) => (
                <button key={item} onClick={() => setRequestFilter(item)} className={`whitespace-nowrap rounded-full px-3 py-2 text-sm border shadow-sm ${requestFilter === item ? 'bg-[#E9333A] text-white border-[#E9333A]' : 'bg-white text-[#334155] border-[#CBD5E1]'}`}>
                  {item}
                </button>
              ))}
            </div>
          </Panel>
          {filteredRequests.map((request) => (
            <Panel key={request.id}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-semibold text-[#0F172A]">{request.id}</h3>
                  <p className="text-sm text-[#64748B]">{request.requester}</p>
                </div>
                <span className={`text-xs rounded-full px-3 py-1 border shadow-sm ${request.urgency === 'Critical' ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]' : request.urgency === 'High' ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]' : 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'}`}>{request.urgency}</span>
              </div>
              <div className="text-sm text-[#475569] space-y-1 mb-3">
                <p>Type: {request.type}</p>
                <p>Location: {request.location}</p>
                <p>Status: {request.status}</p>
              </div>
              <button onClick={() => { setSelectedRequestId(request.id); setPage('assign'); }} className="w-full rounded-xl bg-[#1E293B] text-white py-3 shadow-sm">Choose Team</button>
            </Panel>
          ))}
        </div>
      </Screen>
    );
  };

  const AssignTeamPage = () => {
    const assignVolunteer = (volunteerId) => {
      const person = volunteerPool.find((v) => v.id === volunteerId);
      if (!person || !selectedRequest) return;
      setVolunteerPool((prev) => prev.map((v) => (v.id === volunteerId ? { ...v, status: 'Busy' } : v)));
      setIncomingRequests((prev) => prev.map((r) => (r.id === selectedRequest.id ? { ...r, status: 'Team Assigned', assignedVolunteerId: volunteerId } : r)));
      setPage('tasks');
      showToast(`${person.name} assigned to ${selectedRequest.id}`);
    };

    const skillMapText = {
      Medical: 'Medical / First Aid',
      'Food & Water': 'Food Distribution',
      Rescue: 'Search & Rescue',
      Shelter: 'Transportation',
    };

    return (
      <Screen>
        <Header title="Assign Team" subtitle="Smart filter for free volunteers" back />
        <div className="p-4 space-y-4">
          {selectedRequest && (
            <Panel>
              <h3 className="font-semibold text-[#0F172A] mb-2">Selected Request</h3>
              <div className="text-sm text-[#475569] space-y-1">
                <p>ID: {selectedRequest.id}</p>
                <p>Requester: {selectedRequest.requester}</p>
                <p>Type: {selectedRequest.type}</p>
                <p>Location: {selectedRequest.location}</p>
                <p>People: {selectedRequest.people}</p>
                <p>Required Skill: <span className="text-[#0F172A] font-semibold">{skillMapText[selectedRequest.type]}</span></p>
              </div>
            </Panel>
          )}

          <Panel>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[16px] font-semibold text-[#0F172A]">Matching Volunteers</h2>
              <span className="text-sm text-[#64748B]">{matchingVolunteers.length} found</span>
            </div>
            <div className="space-y-3">
              {matchingVolunteers.length === 0 && <div className="text-sm text-[#64748B]">No free volunteer matches this request.</div>}
              {matchingVolunteers.map((item) => (
                <div key={item.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-semibold text-[#0F172A]">{item.name}</h3>
                      <p className="text-sm text-[#64748B]">{item.skill}</p>
                    </div>
                    <span className="text-xs rounded-full px-3 py-1 border bg-[#ECFDF5] text-[#059669] border-[#A7F3D0] shadow-sm">Free</span>
                  </div>
                  <div className="text-sm text-[#475569] space-y-1 mb-3">
                    <p>Area: {item.area}</p>
                    <p>Phone: {item.phone}</p>
                  </div>
                  <button onClick={() => assignVolunteer(item.id)} className="w-full rounded-xl bg-[#E9333A] text-white py-3 shadow-[0_10px_24px_rgba(233,51,58,0.18)]">Assign Volunteer</button>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </Screen>
    );
  };

  const ResourcesPage = () => (
    <Screen>
      <Header title="Resource Inventory" back />
      <div className="p-4 space-y-4">
        <Panel className="space-y-3">
          <input placeholder="Search resources..." className="w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 outline-none text-[#0F172A] placeholder:text-[#94A3B8]" />
          <button className="w-full rounded-xl bg-[#1E293B] text-white py-3 text-[14px] shadow-sm">＋ Add Resource</button>
        </Panel>

        <div className="grid grid-cols-3 gap-2">
          {[["5", "Categories"], ["3,155", "Total Items"], ["1", "Low Stock"]].map(([n, t]) => (
            <div key={t} className="rounded-2xl border border-[#E2E8F0] bg-white py-3 text-center shadow-sm">
              <div className="text-[18px] font-bold text-[#0F172A]">{n}</div>
              <div className="text-[11px] text-[#64748B]">{t}</div>
            </div>
          ))}
        </div>

        <Panel className="p-0 overflow-hidden">
          <div className="grid grid-cols-[1.6fr_.6fr_.8fr] bg-[#F8FAFC] text-[#0F172A] text-[14px] px-3 py-3 rounded-t-[20px] border-b border-[#E2E8F0] font-medium">
            <div>Resource</div>
            <div>Qty</div>
            <div>Status</div>
          </div>
          <div>
            {resources.map((item) => (
              <div key={item.name} className="grid grid-cols-[1.6fr_.6fr_.8fr] px-3 py-2 border-t border-[#E2E8F0] text-[13px] items-start bg-white">
                <div>
                  <div className="text-[#0F172A]">{item.name}</div>
                  <div className="text-[#64748B]">{item.location}</div>
                </div>
                <div>
                  <div className="text-[#0F172A]">{item.qty}</div>
                  <div className="text-[#64748B]">{item.unit}</div>
                </div>
                <div className="pt-1">
                  <span className={`inline-block border px-2 py-1 text-[11px] rounded-full shadow-sm ${item.status === 'Low Stock' ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]' : 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <button className="w-full rounded-xl border border-[#CBD5E1] bg-white py-3 text-[#334155] shadow-sm">Export Inventory Report</button>
        <button className="w-full rounded-xl border border-[#CBD5E1] bg-white py-3 text-[#334155] shadow-sm">Request Restocking</button>
      </div>
    </Screen>
  );

  const SheltersPage = () => (
    <Screen>
      <Header title="Shelter Management" back />
      <div className="p-4 space-y-4">
        <Panel>
          <div className="text-[18px] font-bold text-[#0F172A] mb-4">Overview</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[["3", "Total Shelter"], ["382", "Occupied"], ["268", "Available"]].map(([n, t]) => (
              <div key={t}>
                <div className="text-[20px] font-bold text-[#0F172A]">{n}</div>
                <div className="text-[12px] text-[#64748B]">{t}</div>
              </div>
            ))}
          </div>
        </Panel>

        {shelters.map((item) => {
          const percent = Math.round((item.occupied / item.capacity) * 100);
          const available = item.capacity - item.occupied;
          return (
            <Panel key={item.name} className="p-0 overflow-hidden">
              <div className="bg-[#F8FAFC] px-4 py-3 rounded-t-[20px] border-b border-[#E2E8F0]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[16px] text-[#0F172A]">{item.name}</h3>
                    <p className="text-[12px] text-[#64748B] mt-1">📍 {item.address}</p>
                  </div>
                  <span className={`text-[11px] border px-3 py-1 rounded-full shadow-sm ${available > 0 ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]' : 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'}`}>{available > 0 ? 'Available' : 'Full'}</span>
                </div>
              </div>
              <div className="p-4 bg-white">
                <div className="flex items-center justify-between text-[14px] mb-1 text-[#334155]"><span>Capacity</span><span>{item.occupied} / {item.capacity}</span></div>
                <div className="h-3 rounded-full bg-[#E2E8F0] overflow-hidden mb-3"><div className="h-full bg-[#1E293B]" style={{ width: `${Math.min(percent, 100)}%` }} /></div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="rounded-2xl border border-[#E2E8F0] p-4 text-center bg-[#F8FAFC] shadow-sm"><div className="text-[18px] font-bold text-[#0F172A]">{item.occupied}</div><div className="text-[12px] text-[#64748B]">Occupied</div></div>
                  <div className="rounded-2xl border border-[#E2E8F0] p-4 text-center bg-[#F8FAFC] shadow-sm"><div className="text-[18px] font-bold text-[#0F172A]">{available}</div><div className="text-[12px] text-[#64748B]">Available</div></div>
                </div>
                <div className="text-[14px] text-[#334155] mb-2">Capacity</div>
                <div className="grid grid-cols-4 gap-2 mb-4 text-[12px]">
                  {['Water', 'Medical', 'Food', 'Showers'].map((tag, i) => <div key={tag} className={`rounded-full px-2 py-1 text-center shadow-sm ${i === 1 || i === 3 ? 'bg-white border border-[#CBD5E1] text-[#334155]' : 'bg-[#1E293B] text-white'}`}>{tag}</div>)}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="rounded-xl border border-[#CBD5E1] bg-white py-3 text-[#334155] shadow-sm">View Details</button>
                  <button className="rounded-xl bg-[#1E293B] text-white py-3 shadow-sm">Manage</button>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </Screen>
  );

  const TaskBoardPage = () => {
    const taskRequests = incomingRequests.filter((r) => r.assignedVolunteerId);
    const counts = {
      total: taskRequests.length || 5,
      pending: incomingRequests.filter((r) => r.status === 'Pending').length || 2,
      active: incomingRequests.filter((r) => r.status === 'In Progress' || r.status === 'Team Assigned').length || 5,
      done: incomingRequests.filter((r) => r.status === 'Completed').length || 1,
    };

    const updateTaskStatus = (id, nextStatus) => {
      setIncomingRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)));
      showToast(`Task ${id} moved to ${nextStatus}`);
    };

    return (
      <Screen>
        <Header title="Task Assignment" back />
        <div className="p-4 space-y-4">
          <Panel className="space-y-3">
            <div className="grid grid-cols-[1fr_1fr_56px] gap-3">
              <button className="rounded-xl border border-[#CBD5E1] bg-white py-3 text-[#334155] shadow-sm">All tasks</button>
              <button className="rounded-xl border border-[#CBD5E1] bg-white py-3 text-[#334155] shadow-sm">Pending</button>
              <button className="rounded-xl border border-[#CBD5E1] bg-white py-3 text-[#334155] shadow-sm">⌛</button>
            </div>
            <button className="w-full rounded-xl bg-[#1E293B] text-white py-3 shadow-sm">＋ Create New Task</button>
          </Panel>

          <div className="grid grid-cols-4 gap-3">
            {[[counts.total, 'Total'], [counts.pending, 'Pending'], [counts.active, 'Active'], [counts.done, 'Done']].map(([n, t]) => (
              <div key={t} className="rounded-2xl border border-[#E2E8F0] bg-white py-3 text-center shadow-sm"><div className="text-[18px] font-bold text-[#0F172A]">{n}</div><div className="text-[11px] text-[#64748B]">{t}</div></div>
            ))}
          </div>

          {taskRequests.map((task) => {
            const assigned = volunteerPool.find((v) => v.id === task.assignedVolunteerId);
            return (
              <Panel key={task.id} className="p-0 overflow-hidden">
                <div className="bg-[#F8FAFC] px-4 py-3 rounded-t-[20px] border-b border-[#E2E8F0]">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-[16px] text-[#0F172A]">{task.type} - {task.location}</h3>
                    <span className={`text-[11px] rounded-full px-3 py-1 shadow-sm ${task.urgency === 'Critical' ? 'bg-[#FEE2E2] text-[#DC2626]' : task.urgency === 'High' ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#EFF6FF] text-[#2563EB]'}`}>{task.urgency}</span>
                  </div>
                  <div className="mt-2 inline-block text-[11px] border border-[#CBD5E1] bg-white px-3 py-1 rounded-full shadow-sm text-[#334155]">{task.status}</div>
                </div>
                <div className="p-4 text-[13px] space-y-2 bg-white text-[#334155]">
                  <div>👤 Assigned to: <span className="font-semibold text-[#0F172A]">{assigned?.name || 'Unassigned'}</span></div>
                  <div>🕒 Deadline: <span className="font-semibold text-[#0F172A]">Today 6:00 PM</span></div>
                  <div>📍 Location: <span className="font-semibold text-[#0F172A]">{task.location}</span></div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button onClick={() => updateTaskStatus(task.id, 'In Progress')} className="rounded-xl border border-[#CBD5E1] bg-white py-2 text-[#334155] shadow-sm">View Progress</button>
                    <button onClick={() => updateTaskStatus(task.id, 'Completed')} className="rounded-xl bg-[#1E293B] text-white py-2 shadow-sm">Mark Complete</button>
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      </Screen>
    );
  };

  const DonatePage = () => (
    <Screen>
      <Header title="Donation Dashboard" back />
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[[`${totalRaised}/-`, 'Total Monetary'], ['248', 'Total Donors'], ['1,450', 'Supply Items'], ['12', 'This Week']].map(([n, t], idx) => (
            <div key={t} className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
              <div className={`text-[28px] mb-2 ${idx === 0 ? 'text-[#E9333A]' : idx === 1 ? 'text-[#1E293B]' : idx === 2 ? 'text-[#2563EB]' : 'text-[#F59E0B]'}`}>◉</div>
              <div className="text-[18px] font-bold text-[#0F172A]">{n}</div>
              <div className="text-[12px] text-[#64748B]">{t}</div>
            </div>
          ))}
        </div>

        <Panel>
          <div className="text-[18px] font-bold text-[#0F172A] mb-4">Fund Allocation</div>
          {[
            ['Food & Water', '35%', '12,450/-'],
            ['Medical', '23%', '8,200/-'],
            ['Shelter', '30%', '10,500/-'],
            ['Other', '12%', '4,350/-'],
          ].map(([label, pct, amt]) => (
            <div key={label} className="mb-3">
              <div className="flex items-center justify-between text-[14px] mb-1 text-[#334155]"><span>{label}</span><span>{amt}</span></div>
              <div className="h-5 bg-[#E2E8F0] rounded-full overflow-hidden"><div className="h-full bg-[#1E293B] text-white text-[11px] flex items-center justify-center" style={{ width: pct }}>{pct}</div></div>
            </div>
          ))}
          <div className="flex items-center justify-between text-[14px] border-t border-[#E2E8F0] pt-3 mt-3 text-[#334155]"><span>Total Allocated</span><span className="text-[#0F172A] font-semibold">{totalRaised}/-</span></div>
        </Panel>

        <Panel className="p-0 overflow-hidden">
          <div className="px-4 py-4 font-bold text-[18px] text-[#0F172A]">Recent Donations</div>
          {[
            ['John Smith', 'Monetary', '500/-', 'Mar 14, 2026'],
            ['Sarah Johnson', 'Food Packages', '100/-', 'Mar 14, 2026'],
            ['ABC Corporation', 'Medical Kits', '300/-', 'Mar 14, 2026'],
            [donation.name || 'Anonymous', donation.method, donation.submitted ? `${donation.amount}/-` : '250/-', donation.submitted ? 'Today' : 'Mar 14, 2026'],
          ].map(([name, type, amount, date]) => (
            <div key={`${name}-${amount}`} className="px-4 py-3 border-t border-[#E2E8F0] flex items-center justify-between gap-3 bg-white">
              <div>
                <div className="text-[#0F172A]">{name}</div>
                <div className="text-[12px] text-[#64748B]">{type}</div>
              </div>
              <div className="text-right">
                <div className="text-[#0F172A]">{amount}</div>
                <div className="text-[12px] text-[#64748B]">{date}</div>
              </div>
            </div>
          ))}
          <button className="w-full border-t border-[#E2E8F0] py-3 bg-[#F8FAFC] text-[#334155]">View All Donations</button>
        </Panel>

        <button
          onClick={() => {
            setDonation((prev) => ({ ...prev, submitted: true }));
            showToast('Donation added to dashboard');
          }}
          className="w-full rounded-xl bg-[#E9333A] text-white py-4 text-[16px] font-semibold shadow-[0_10px_24px_rgba(233,51,58,0.22)]"
        >
          Record New Donation
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button className="rounded-xl border border-[#CBD5E1] bg-white py-3 text-[#334155] shadow-sm">Export Report</button>
          <button className="rounded-xl border border-[#CBD5E1] bg-white py-3 text-[#334155] shadow-sm">Send Thanks</button>
        </div>

        <Panel className="space-y-4">
          <div className="text-[18px] font-bold text-[#0F172A]">Add Donation</div>
          <div>
            <label className="text-[14px] text-[#0F172A] font-medium block mb-2">Choose Amount</label>
            <div className="grid grid-cols-3 gap-3">
              {[100, 500, 1000].map((amount) => (
                <button key={amount} onClick={() => setDonation({ ...donation, amount, submitted: false })} className={`rounded-xl py-3 border shadow-sm ${donation.amount === amount ? 'bg-[#1E293B] text-white border-[#1E293B]' : 'bg-white border-[#CBD5E1] text-[#334155]'}`}>{amount}/-</button>
              ))}
            </div>
          </div>
          <Input label="Donor Name" placeholder="Optional name" value={donation.name} onChange={(e) => setDonation({ ...donation, name: e.target.value, submitted: false })} />
          <div>
            <label className="text-[14px] text-[#0F172A] font-medium block mb-2">Payment Method</label>
            <div className="grid grid-cols-3 gap-3">
              {['Bkash', 'Nagad', 'Card'].map((method) => (
                <button key={method} onClick={() => setDonation({ ...donation, method, submitted: false })} className={`rounded-xl py-3 border shadow-sm ${donation.method === method ? 'bg-[#E9333A] text-white border-[#E9333A]' : 'bg-white border-[#CBD5E1] text-[#334155]'}`}>{method}</button>
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </Screen>
  );

  const pages = {
    home: <HomePage />,
    aid: <AidPage />,
    aidSuccess: <AidSuccessPage />,
    volunteer: <VolunteerPage />,
    volunteerSuccess: <VolunteerSuccessPage />,
    volunteerList: <VolunteerListPage />,
    requests: <RequestsPage />,
    assign: <AssignTeamPage />,
    resources: <ResourcesPage />,
    shelters: <SheltersPage />,
    tasks: <TaskBoardPage />,
    donate: <DonatePage />,
  };

  return (
    <div className="min-h-screen bg-[#EAF0F6] flex items-center justify-center p-6">
      <div className="w-[390px] overflow-hidden rounded-[28px] shadow-[0_24px_60px_rgba(15,23,42,0.18)] bg-[#F5F7FA] border border-[#D7E0EA] relative">
        {pages[page]}
        {notification && (
          <div className="absolute left-4 right-4 bottom-4 rounded-2xl bg-[#0F172A] text-white px-4 py-3 shadow-2xl text-sm flex items-center justify-between gap-3">
            <span>{notification}</span>
            <button onClick={() => setNotification('')} className="text-white/70">✕</button>
          </div>
        )}
      </div>
    </div>
  );
}
