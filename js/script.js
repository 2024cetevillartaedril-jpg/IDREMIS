async function deleteRequest(id) {
    if (!id || id === 'undefined' || id === 'null') {
        alert('Cannot delete: Invalid or missing Request ID.');
        return;
    }

    if (!confirm(`Are you sure you want to delete Request #${id}?`)) {
        return;
    }

    try {
        const res = await fetch(`/api/requests/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Server returned ${res.status}: ${errText}`);
        }

        const result = await res.json();

        if (result.success) {
            if (typeof loadAdminIncidents === 'function') {
                loadAdminIncidents();
            } else {
                window.location.reload();
            }
        } else {
            alert(
                'Delete Failed: ' +
                (result.error || 'Server error occurred')
            );
        }

    } catch (err) {
        console.error('Delete error:', err);
        alert('Error deleting record: ' + err.message);
    }
}

window.deleteRequest = deleteRequest;

window.openViewModal = function (
    id,
    name,
    phone,
    location,
    type,
    tags,
    details
) {
    let viewModal =
        document.getElementById('viewModal');

    if (!viewModal) {
        createViewModalHTML();
        viewModal =
            document.getElementById('viewModal');
    }

    document.getElementById('viewId').textContent =
        '#' + id;

    document.getElementById('viewName').textContent =
        name || 'N/A';

    document.getElementById('viewPhone').textContent =
        phone || 'N/A';

    document.getElementById('viewLocation').textContent =
        location || 'N/A';

    document.getElementById('viewType').textContent =
        type || 'General';

    document.getElementById('viewTags').textContent =
        tags || 'None';

    document.getElementById('viewDetails').textContent =
        details || 'No additional details provided.';

    viewModal.style.display = 'flex';
};

function createViewModalHTML() {
    if (document.getElementById('viewModal')) {
        return;
    }

    const modalHtml = `
        <div id="viewModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.75); z-index:9999; align-items:center; justify-content:center;">
            <div style="background:#1e293b; color:#f8fafc; width:90%; max-width:450px; padding:24px; border-radius:8px; box-shadow:0 10px 25px rgba(0,0,0,0.5); font-family:inherit;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #334155; padding-bottom:12px; margin-bottom:16px;">
                    <h3 style="margin:0; font-size:1.25rem; color:#38bdf8;">
                        Incident Details <span id="viewId"></span>
                    </h3>

                    <button
                        type="button"
                        onclick="document.getElementById('viewModal').style.display='none'"
                        style="background:transparent; border:none; color:#94a3b8; font-size:1.25rem; cursor:pointer;"
                    >
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div style="display:flex; flex-direction:column; gap:10px; font-size:0.95rem;">
                    <div>
                        <strong>Name:</strong>
                        <span id="viewName"></span>
                    </div>

                    <div>
                        <strong>Phone:</strong>
                        <span id="viewPhone"></span>
                    </div>

                    <div>
                        <strong>Location:</strong>
                        <span id="viewLocation"></span>
                    </div>

                    <div>
                        <strong>Emergency Type:</strong>
                        <span id="viewType"></span>
                    </div>

                    <div>
                        <strong>Tags/Status:</strong>
                        <span id="viewTags"></span>
                    </div>

                    <div>
                        <strong>Additional Details:</strong>

                        <p
                            id="viewDetails"
                            style="background:#0f172a; padding:8px; border-radius:4px; border:1px solid #334155; margin-top:4px; white-space:pre-wrap;"
                        ></p>
                    </div>
                </div>

                <div style="text-align:right; margin-top:16px;">
                    <button
                        type="button"
                        onclick="document.getElementById('viewModal').style.display='none'"
                        style="background:#0284c7; color:#fff; border:none; padding:8px 16px; border-radius:4px; cursor:pointer;"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML(
        'beforeend',
        modalHtml
    );
}

window.openEditModal = function (
    id = '',
    firstName = '',
    middleInitial = '',
    lastName = '',
    phone = '',
    location = '',
    type = '',
    tags = '',
    details = ''
) {
    let editModal =
        document.getElementById('editIncidentModal');

    if (!editModal) {
        createEditModalHTML();

        editModal =
            document.getElementById('editIncidentModal');
    }

    document.getElementById('editRecordId').value = id;
    document.getElementById('editFirstName').value = firstName;
    document.getElementById('editMiddleInitial').value = middleInitial;
    document.getElementById('editLastName').value = lastName;
    document.getElementById('editPhone').value = phone;
    document.getElementById('editLocation').value = location;
    document.getElementById('editType').value = type;
    document.getElementById('editTags').value = tags;
    document.getElementById('editDetails').value = details;

    const titleEl =
        document.getElementById(
            'editModalHeaderTitle'
        );

    if (titleEl) {
        titleEl.innerHTML = id
            ? `<i class="fa-solid fa-pen-to-square" style="margin-right:8px;"></i>Manage Incident #${id}`
            : `<i class="fa-solid fa-triangle-exclamation" style="margin-right:8px;"></i>New Emergency Log`;
    }

    editModal.style.display = 'flex';
};

function createEditModalHTML() {
    if (
        document.getElementById(
            'editIncidentModal'
        )
    ) {
        return;
    }

    const modalHtml = `
        <div id="editIncidentModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.75); z-index:9999; align-items:center; justify-content:center;">
            <div style="background:#1e293b; color:#f8fafc; width:90%; max-width:500px; padding:24px; border-radius:8px; box-shadow:0 10px 25px rgba(0,0,0,0.5); font-family:inherit; max-height:90vh; overflow-y:auto;">

                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #334155; padding-bottom:12px; margin-bottom:16px;">

                    <h3
                        id="editModalHeaderTitle"
                        style="margin:0; font-size:1.25rem; color:#38bdf8;"
                    >
                        <i class="fa-solid fa-pen-to-square" style="margin-right:8px;"></i>
                        Manage Incident
                    </h3>

                    <button
                        type="button"
                        onclick="document.getElementById('editIncidentModal').style.display='none'"
                        style="background:transparent; border:none; color:#94a3b8; font-size:1.25rem; cursor:pointer;"
                    >
                        <i class="fa-solid fa-xmark"></i>
                    </button>

                </div>

                <form id="editIncidentForm">

                    <input
                        type="hidden"
                        id="editRecordId"
                    >

                    <div style="display:flex; gap:8px; margin-bottom:12px;">

                        <div style="flex:2;">
                            <label style="display:block; font-size:0.85rem; color:#cbd5e1; margin-bottom:4px;">
                                First Name *
                            </label>

                            <input
                                type="text"
                                id="editFirstName"
                                required
                                style="width:100%; padding:8px; background:#0f172a; border:1px solid #334155; color:#fff; border-radius:4px; box-sizing:border-box;"
                            >
                        </div>

                        <div style="flex:1;">
                            <label style="display:block; font-size:0.85rem; color:#cbd5e1; margin-bottom:4px;">
                                M.I.
                            </label>

                            <input
                                type="text"
                                id="editMiddleInitial"
                                maxlength="5"
                                style="width:100%; padding:8px; background:#0f172a; border:1px solid #334155; color:#fff; border-radius:4px; box-sizing:border-box;"
                            >
                        </div>

                        <div style="flex:2;">
                            <label style="display:block; font-size:0.85rem; color:#cbd5e1; margin-bottom:4px;">
                                Last Name *
                            </label>

                            <input
                                type="text"
                                id="editLastName"
                                required
                                style="width:100%; padding:8px; background:#0f172a; border:1px solid #334155; color:#fff; border-radius:4px; box-sizing:border-box;"
                            >
                        </div>

                    </div>

                    <div style="margin-bottom:12px;">
                        <label style="display:block; font-size:0.85rem; color:#cbd5e1; margin-bottom:4px;">
                            Phone Number *
                        </label>

                        <input
                            type="text"
                            id="editPhone"
                            required
                            style="width:100%; padding:8px; background:#0f172a; border:1px solid #334155; color:#fff; border-radius:4px; box-sizing:border-box;"
                        >
                    </div>

                    <div style="margin-bottom:12px;">
                        <label style="display:block; font-size:0.85rem; color:#cbd5e1; margin-bottom:4px;">
                            Location / Barangay *
                        </label>

                        <input
                            type="text"
                            id="editLocation"
                            required
                            style="width:100%; padding:8px; background:#0f172a; border:1px solid #334155; color:#fff; border-radius:4px; box-sizing:border-box;"
                        >
                    </div>

                    <div style="margin-bottom:12px;">
                        <label style="display:block; font-size:0.85rem; color:#cbd5e1; margin-bottom:4px;">
                            Emergency Type
                        </label>

                        <input
                            type="text"
                            id="editType"
                            style="width:100%; padding:8px; background:#0f172a; border:1px solid #334155; color:#fff; border-radius:4px; box-sizing:border-box;"
                        >
                    </div>

                    <div style="margin-bottom:12px;">
                        <label style="display:block; font-size:0.85rem; color:#cbd5e1; margin-bottom:4px;">
                            Quick Status / Tags
                        </label>

                        <input
                            type="text"
                            id="editTags"
                            style="width:100%; padding:8px; background:#0f172a; border:1px solid #334155; color:#fff; border-radius:4px; box-sizing:border-box;"
                        >
                    </div>

                    <div style="margin-bottom:16px;">
                        <label style="display:block; font-size:0.85rem; color:#cbd5e1; margin-bottom:4px;">
                            Additional Details
                        </label>

                        <textarea
                            id="editDetails"
                            rows="3"
                            style="width:100%; padding:8px; background:#0f172a; border:1px solid #334155; color:#fff; border-radius:4px; box-sizing:border-box; resize:vertical;"
                        ></textarea>
                    </div>

                    <div style="text-align:right; display:flex; gap:8px; justify-content:flex-end;">

                        <button
                            type="button"
                            onclick="document.getElementById('editIncidentModal').style.display='none'"
                            style="background:#475569; color:#fff; border:none; padding:8px 16px; border-radius:4px; cursor:pointer;"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            style="background:#0284c7; color:#fff; border:none; padding:8px 16px; border-radius:4px; cursor:pointer; font-weight:600;"
                        >
                            Save Changes
                        </button>

                    </div>

                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML(
        'beforeend',
        modalHtml
    );

    const form =
        document.getElementById(
            'editIncidentForm'
        );

    form.addEventListener(
        'submit',
        async function (e) {
            e.preventDefault();

            const id =
                document
                    .getElementById('editRecordId')
                    .value
                    .trim();

            const tagsValue =
                document
                    .getElementById('editTags')
                    .value
                    .trim() || 'pending';

            const payload = {
                first_name:
                    document
                        .getElementById('editFirstName')
                        .value
                        .trim(),

                middle_initial:
                    document
                        .getElementById('editMiddleInitial')
                        .value
                        .trim(),

                last_name:
                    document
                        .getElementById('editLastName')
                        .value
                        .trim(),

                phone_number:
                    document
                        .getElementById('editPhone')
                        .value
                        .trim(),

                location:
                    document
                        .getElementById('editLocation')
                        .value
                        .trim(),

                emergency_type:
                    document
                        .getElementById('editType')
                        .value
                        .trim() || 'General',

                quick_status:
                    tagsValue,

                selected_tags:
                    tagsValue,

                additional_details:
                    document
                        .getElementById('editDetails')
                        .value
                        .trim()
            };

            const isEdit =
                Boolean(id);

            const url =
                isEdit
                    ? `/api/requests/${id}`
                    : `/api/requests`;

            const method =
                isEdit
                    ? 'PUT'
                    : 'POST';

            try {
                const res =
                    await fetch(url, {
                        method: method,
                        headers: {
                            'Content-Type':
                                'application/json'
                        },
                        body:
                            JSON.stringify(payload)
                    });

                if (!res.ok) {
                    const errText =
                        await res.text();

                    throw new Error(
                        `Server returned ${res.status}: ${errText}`
                    );
                }

                const result =
                    await res.json();

                if (result.success) {
                    document
                        .getElementById(
                            'editIncidentModal'
                        )
                        .style.display = 'none';

                    if (
                        typeof loadAdminIncidents ===
                        'function'
                    ) {
                        loadAdminIncidents();
                    }
                } else {
                    alert(
                        'Save failed: ' +
                        (
                            result.error ||
                            'Server error occurred'
                        )
                    );
                }

            } catch (err) {
                console.error(
                    'Save error details:',
                    err
                );

                alert(
                    'Error connecting to the server: ' +
                    err.message
                );
            }
        }
    );
}

document.addEventListener(
    'DOMContentLoaded',
    function () {

        createViewModalHTML();
        createEditModalHTML();

        const labangalPuroks = [
            "Purok Acharon",
            "Purok Bag-ong Katilingban",
            "Purok Bagong Silang",
            "Purok Balunto",
            "Purok Bulaong Extension",
            "Purok Bulaong Phase 1",
            "Purok Bulaong Phase II",
            "Purok EMB Homes",
            "Purok Kindat",
            "Purok Kulasi",
            "Purok Madarang",
            "Purok Magsaysay A",
            "Purok Magsaysay B",
            "Purok Maguindanao",
            "Purok Malipayon",
            "Purok Maliwanag",
            "Purok Malok",
            "Purok Masipag",
            "Purok Matinabangon",
            "Purok Mauswagon",
            "Purok Maypagkakaisa (Saway)",
            "Purok Mudia / Ybañez",
            "Purok Nagkakaisa",
            "Purok Palen",
            "Purok Roberto",
            "Purok Saludin",
            "Purok San Roque",
            "Purok San Vicente",
            "Purok Soledad Phase 1 West",
            "Purok Soledad Phase 1 East",
            "Purok Soledad Phase 2A",
            "Purok Soledad Phase 2B",
            "Purok Soledad Phase 3A",
            "Purok Soledad Phase 3B",
            "Purok Soledad Phase 4",
            "Purok Soledad Phase 5",
            "Purok Soledad Phase 6",
            "Purok Talon"
        ];

        const emergencyForm =
            document.getElementById(
                'emergencyForm'
            );

        const barangayWrapper =
            document.getElementById(
                'barangayWrapper'
            );

        const locationInput =
            document.getElementById(
                'locationInput'
            );

        const barangayList =
            document.getElementById(
                'barangayList'
            );

        const noBarangayMsg =
            document.getElementById(
                'noBarangayMsg'
            );

        const purokWrapper =
            document.getElementById(
                'purokWrapper'
            );

        const purokInput =
            document.getElementById(
                'purokInput'
            );

        const purokList =
            document.getElementById(
                'purokList'
            );

        const purokHeaderTitle =
            document.getElementById(
                'purokHeaderTitle'
            );

        const noPurokMsg =
            document.getElementById(
                'noPurokMsg'
            );

        const emergencyWrapper =
            document.getElementById(
                'emergencySelectWrapper'
            );

        const emergencyTrigger =
            document.getElementById(
                'emergencyTrigger'
            );

        const emergencyDropdown =
            document.getElementById(
                'emergencyDropdownCard'
            );

        const emergencySelectedText =
            document.getElementById(
                'emergencySelectedText'
            );

        const emergencyHiddenInput =
            document.getElementById(
                'emergency_type'
            );

        const tagsContainer =
            document.getElementById(
                'tagsContainer'
            );

        const clearTagsBtn =
            document.getElementById(
                'clearTagsBtn'
            );

        const selectedTagsInput =
            document.getElementById(
                'selected_tags'
            );

        const confirmModal =
            document.getElementById(
                'confirmModal'
            );

        const cancelModalBtn =
            document.getElementById(
                'cancelModalBtn'
            );

        const confirmSendBtn =
            document.getElementById(
                'confirmSendBtn'
            );

        const summaryName =
            document.getElementById(
                'summaryName'
            );

        const summaryPhone =
            document.getElementById(
                'summaryPhone'
            );

        const summaryLocation =
            document.getElementById(
                'summaryLocation'
            );

        const summaryType =
            document.getElementById(
                'summaryType'
            );

        const btnNewIncident =
            document.querySelector(
                '#incidents .btn-action'
            );

        if (btnNewIncident) {
            btnNewIncident.addEventListener(
                'click',
                function () {
                    window.openEditModal();
                }
            );
        }

        const navItems =
            document.querySelectorAll(
                '.sidebar-nav .nav-item'
            );

        const cards =
            document.querySelectorAll(
                '.main-content .card'
            );

        navItems.forEach(
            function (item) {
                item.addEventListener(
                    'click',
                    function (e) {
                        e.preventDefault();

                        const href =
                            item.getAttribute(
                                'href'
                            );

                        if (
                            !href ||
                            !href.startsWith('#')
                        ) {
                            return;
                        }

                        const targetId =
                            href.substring(1);

                        navItems.forEach(
                            function (nav) {
                                nav.classList.remove(
                                    'active'
                                );
                            }
                        );

                        cards.forEach(
                            function (card) {
                                card.style.display =
                                    'none';
                            }
                        );

                        item.classList.add(
                            'active'
                        );

                        const targetCard =
                            document.getElementById(
                                targetId
                            );

                        if (targetCard) {
                            targetCard.style.display =
                                'block';
                        }
                    }
                );
            }
        );

        if (cards.length > 0) {
            cards.forEach(
                function (card, index) {
                    card.style.display =
                        index === 0
                            ? 'block'
                            : 'none';
                }
            );
        }

        const searchInputs =
            document.querySelectorAll(
                '.tab-search-input'
            );

        searchInputs.forEach(
            function (searchInput) {
                searchInput.addEventListener(
                    'input',
                    function () {
                        const searchValue =
                            searchInput.value
                                .toLowerCase()
                                .trim();

                        const card =
                            searchInput.closest(
                                '.card'
                            );

                        if (!card) {
                            return;
                        }

                        const table =
                            card.querySelector(
                                'table'
                            );

                        if (!table) {
                            return;
                        }

                        const rows =
                            table.querySelectorAll(
                                'tbody tr'
                            );

                        rows.forEach(
                            function (row) {
                                const rowText =
                                    row.textContent
                                        .toLowerCase();

                                row.style.display =
                                    !searchValue ||
                                    rowText.includes(
                                        searchValue
                                    )
                                        ? ''
                                        : 'none';
                            }
                        );
                    }
                );
            }
        );

        if (purokInput) {
            purokInput.disabled = true;
            purokInput.placeholder =
                'Select Barangay First...';
        }

        if (locationInput) {

            locationInput.addEventListener(
                'focus',
                function () {
                    barangayWrapper?.classList.add(
                        'is-open'
                    );
                }
            );

            locationInput.addEventListener(
                'click',
                function () {
                    barangayWrapper?.classList.add(
                        'is-open'
                    );
                }
            );

            locationInput.addEventListener(
                'input',
                function (e) {

                    const query =
                        e.target.value
                            .toLowerCase()
                            .trim();

                    const options =
                        barangayList
                            ? barangayList.querySelectorAll(
                                '.custom-option'
                            )
                            : [];

                    let visibleCount = 0;

                    options.forEach(
                        function (opt) {

                            const matches =
                                opt.textContent
                                    .toLowerCase()
                                    .includes(query);

                            opt.style.display =
                                matches
                                    ? 'block'
                                    : 'none';

                            if (matches) {
                                visibleCount++;
                            }
                        }
                    );

                    if (noBarangayMsg) {
                        noBarangayMsg.style.display =
                            visibleCount === 0
                                ? 'block'
                                : 'none';
                    }

                    barangayWrapper?.classList.add(
                        'is-open'
                    );

                    if (query === '') {
                        resetPurokField();
                    }
                }
            );
        }

        if (barangayList) {

            barangayList.addEventListener(
                'click',
                function (e) {

                    const option =
                        e.target.closest(
                            '.custom-option'
                        );

                    if (!option) {
                        return;
                    }

                    const selectedBarangay =
                        option
                            .getAttribute(
                                'data-value'
                            )
                            .trim();

                    if (locationInput) {
                        locationInput.value =
                            selectedBarangay;
                    }

                    barangayWrapper?.classList.remove(
                        'is-open'
                    );

                    handleBarangayChange(
                        selectedBarangay
                    );
                }
            );
        }

        function resetPurokField() {

            if (!purokInput) {
                return;
            }

            purokInput.value = '';
            purokInput.disabled = true;
            purokInput.placeholder =
                'Select Barangay First...';

            if (purokList) {
                purokList.innerHTML = '';
            }

            purokWrapper?.classList.remove(
                'is-open'
            );
        }

        function handleBarangayChange(
            barangayName
        ) {

            if (
                !purokInput ||
                !purokList
            ) {
                return;
            }

            purokInput.value = '';
            purokList.innerHTML = '';

            if (
                barangayName
                    .toLowerCase() ===
                'labangal'
            ) {

                purokInput.disabled = false;

                purokInput.placeholder =
                    'Search or select Purok...';

                if (purokHeaderTitle) {
                    purokHeaderTitle.textContent =
                        `Puroks in ${barangayName} (${labangalPuroks.length})`;
                }

                labangalPuroks.forEach(
                    function (purok) {

                        const opt =
                            document.createElement(
                                'div'
                            );

                        opt.className =
                            'custom-option';

                        opt.setAttribute(
                            'data-value',
                            purok
                        );

                        opt.textContent =
                            purok;

                        purokList.appendChild(
                            opt
                        );
                    }
                );

                purokWrapper?.classList.add(
                    'is-open'
                );

                purokInput.focus();

            } else if (
                barangayName.trim() !== ''
            ) {

                purokInput.disabled = false;

                purokInput.placeholder =
                    'e.g. Purok 4';

                if (purokHeaderTitle) {
                    purokHeaderTitle.textContent =
                        'Select Purok';
                }

                purokWrapper?.classList.remove(
                    'is-open'
                );

                purokInput.focus();

            } else {
                resetPurokField();
            }
        }

        if (purokInput) {

            purokInput.addEventListener(
                'focus',
                function () {

                    if (
                        !purokInput.disabled &&
                        purokList?.children.length > 0
                    ) {
                        purokWrapper?.classList.add(
                            'is-open'
                        );
                    }
                }
            );

            purokInput.addEventListener(
                'input',
                function (e) {

                    if (
                        !purokList ||
                        purokList.children.length === 0
                    ) {
                        return;
                    }

                    const query =
                        e.target.value
                            .toLowerCase()
                            .trim();

                    const options =
                        purokList.querySelectorAll(
                            '.custom-option'
                        );

                    let visibleCount = 0;

                    options.forEach(
                        function (opt) {

                            const matches =
                                opt.textContent
                                    .toLowerCase()
                                    .includes(query);

                            opt.style.display =
                                matches
                                    ? 'block'
                                    : 'none';

                            if (matches) {
                                visibleCount++;
                            }
                        }
                    );

                    if (noPurokMsg) {
                        noPurokMsg.style.display =
                            visibleCount === 0
                                ? 'block'
                                : 'none';
                    }

                    purokWrapper?.classList.add(
                        'is-open'
                    );
                }
            );
        }

        if (purokList) {

            purokList.addEventListener(
                'click',
                function (e) {

                    const option =
                        e.target.closest(
                            '.custom-option'
                        );

                    if (!option) {
                        return;
                    }

                    if (purokInput) {
                        purokInput.value =
                            option.getAttribute(
                                'data-value'
                            );
                    }

                    purokWrapper?.classList.remove(
                        'is-open'
                    );
                }
            );
        }

        if (emergencyTrigger) {

            emergencyTrigger.addEventListener(
                'click',
                function () {
                    emergencyWrapper?.classList.toggle(
                        'is-open'
                    );
                }
            );
        }

        if (emergencyDropdown) {

            emergencyDropdown.addEventListener(
                'click',
                function (e) {

                    const option =
                        e.target.closest(
                            '.custom-option'
                        );

                    if (!option) {
                        return;
                    }

                    const val =
                        option.getAttribute(
                            'data-value'
                        );

                    const text =
                        option.textContent.trim();

                    if (emergencySelectedText) {
                        emergencySelectedText.textContent =
                            text;
                    }

                    if (emergencyTrigger) {
                        emergencyTrigger.classList.add(
                            'has-value'
                        );
                    }

                    if (emergencyHiddenInput) {
                        emergencyHiddenInput.value =
                            val;
                    }

                    if (emergencyWrapper) {
                        emergencyWrapper.classList.remove(
                            'is-open'
                        );
                    }
                }
            );
        }

        if (tagsContainer) {

            tagsContainer.addEventListener(
                'click',
                function (e) {

                    const chip =
                        e.target.closest(
                            '.tag-chip'
                        );

                    if (!chip) {
                        return;
                    }

                    chip.classList.toggle(
                        'active'
                    );

                    updateSelectedTags();
                }
            );
        }

        if (clearTagsBtn) {

            clearTagsBtn.addEventListener(
                'click',
                function () {

                    if (!tagsContainer) {
                        return;
                    }

                    const activeChips =
                        tagsContainer.querySelectorAll(
                            '.tag-chip.active'
                        );

                    activeChips.forEach(
                        function (chip) {
                            chip.classList.remove(
                                'active'
                            );
                        }
                    );

                    updateSelectedTags();
                }
            );
        }

        function updateSelectedTags() {

            if (
                !tagsContainer ||
                !selectedTagsInput
            ) {
                return;
            }

            const activeChips =
                tagsContainer.querySelectorAll(
                    '.tag-chip.active'
                );

            const selectedValues =
                Array.from(activeChips).map(
                    function (chip) {
                        return chip.getAttribute(
                            'data-value'
                        );
                    }
                );

            selectedTagsInput.value =
                selectedValues.join(',');
        }

        document.addEventListener(
            'click',
            function (e) {

                if (
                    barangayWrapper &&
                    !barangayWrapper.contains(
                        e.target
                    )
                ) {
                    barangayWrapper.classList.remove(
                        'is-open'
                    );
                }

                if (
                    purokWrapper &&
                    !purokWrapper.contains(
                        e.target
                    )
                ) {
                    purokWrapper.classList.remove(
                        'is-open'
                    );
                }

                if (
                    emergencyWrapper &&
                    !emergencyWrapper.contains(
                        e.target
                    )
                ) {
                    emergencyWrapper.classList.remove(
                        'is-open'
                    );
                }
            }
        );

        if (emergencyForm) {

            emergencyForm.addEventListener(
                'submit',
                function (e) {

                    e.preventDefault();

                    const fn =
                        document.getElementById(
                            'firstName'
                        )?.value.trim();

                    const ln =
                        document.getElementById(
                            'lastName'
                        )?.value.trim();

                    const mi =
                        document.getElementById(
                            'middleInitial'
                        )?.value.trim();

                    const phone =
                        document.getElementById(
                            'phoneNumber'
                        )?.value.trim();

                    const brgy =
                        locationInput?.value.trim();

                    const purok =
                        purokInput?.value.trim();

                    const emergencyText =
                        emergencySelectedText
                            ?.textContent
                            .trim();

                    if (
                        !emergencyHiddenInput?.value
                    ) {
                        alert(
                            'Please select an emergency type.'
                        );
                        return;
                    }

                    if (summaryName) {
                        summaryName.textContent =
                            `${fn} ${mi ? mi + ' ' : ''}${ln}`;
                    }

                    if (summaryPhone) {
                        summaryPhone.textContent =
                            phone;
                    }

                    if (summaryLocation) {
                        summaryLocation.textContent =
                            `${purok ? purok + ', ' : ''}${brgy}`;
                    }

                    if (summaryType) {
                        summaryType.textContent =
                            emergencyText;
                    }

                    confirmModal?.classList.add(
                        'is-active'
                    );
                }
            );
        }

        if (cancelModalBtn) {

            cancelModalBtn.addEventListener(
                'click',
                function () {
                    confirmModal?.classList.remove(
                        'is-active'
                    );
                }
            );
        }

        if (confirmSendBtn) {

            confirmSendBtn.addEventListener(
                'click',
                async function () {

                    const payload = {
                        first_name:
                            document
                                .getElementById(
                                    'firstName'
                                )
                                ?.value.trim(),

                        middle_initial:
                            document
                                .getElementById(
                                    'middleInitial'
                                )
                                ?.value.trim(),

                        last_name:
                            document
                                .getElementById(
                                    'lastName'
                                )
                                ?.value.trim(),

                        phone_number:
                            document
                                .getElementById(
                                    'phoneNumber'
                                )
                                ?.value.trim(),

                        location:
                            `${purokInput?.value.trim() ? purokInput.value.trim() + ', ' : ''}${locationInput?.value.trim()}`,

                        emergency_type:
                            emergencyHiddenInput?.value,

                        quick_status:
                            selectedTagsInput?.value ||
                            'pending',

                        selected_tags:
                            selectedTagsInput?.value ||
                            '',

                        additional_details:
                            document
                                .getElementById(
                                    'additionalDetails'
                                )
                                ?.value.trim() || ''
                    };

                    try {

                        const response =
                            await fetch(
                                '/api/requests',
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type':
                                            'application/json'
                                    },
                                    body:
                                        JSON.stringify(
                                            payload
                                        )
                                }
                            );

                        if (!response.ok) {

                            const errText =
                                await response.text();

                            throw new Error(
                                `Server status ${response.status}: ${errText}`
                            );
                        }

                        const result =
                            await response.json();

                        if (result.success) {

                            alert(
                                'Emergency request sent successfully!'
                            );

                            confirmModal?.classList.remove(
                                'is-active'
                            );

                            emergencyForm?.reset();

                            resetPurokField();

                            if (emergencySelectedText) {
                                emergencySelectedText.textContent =
                                    'Select emergency type';
                            }

                            emergencyTrigger?.classList.remove(
                                'has-value'
                            );

                            if (clearTagsBtn) {
                                clearTagsBtn.click();
                            }

                            if (
                                typeof loadAdminIncidents ===
                                'function'
                            ) {
                                loadAdminIncidents();
                            }

                        } else {

                            alert(
                                'Failed to send request: ' +
                                (
                                    result.error ||
                                    'Server error'
                                )
                            );
                        }

                    } catch (err) {

                        console.error(
                            'Submission error:',
                            err
                        );

                        alert(
                            'Error connecting to server: ' +
                            err.message
                        );
                    }
                }
            );
        }

        window.loadAdminIncidents =
            async function () {

                const tbody =
                    document.querySelector(
                        '#incidents tbody'
                    );

                if (!tbody) {
                    return;
                }

                try {

                    const response =
                        await fetch(
                            '/api/requests'
                        );

                    if (!response.ok) {
                        return;
                    }

                    const result =
                        await response.json();

                    if (!result.success) {
                        return;
                    }

                    tbody.innerHTML = '';

                    if (
                        !result.data ||
                        result.data.length === 0
                    ) {

                        tbody.innerHTML = `
                            <tr>
                                <td colspan="8" style="text-align:center;">
                                    No emergency requests logged yet.
                                </td>
                            </tr>
                        `;

                        return;
                    }

                    result.data.forEach(
                        function (req) {

                            const tr =
                                document.createElement(
                                    'tr'
                                );

                            const rowId =
                                req.request_id ||
                                req.id;

                            const fn =
                                req.first_name || '';

                            const mi =
                                req.middle_initial || '';

                            const ln =
                                req.last_name || '';

                            const fullName =
                                `${fn} ${mi ? mi + '.' : ''} ${ln}`
                                    .trim() ||
                                'Anonymous';

                            const displayTags =
                                req.quick_status ||
                                req.selected_tags ||
                                'pending';

                            tr.innerHTML = `
                                <td>
                                    <strong>
                                        #${rowId || 'N/A'}
                                    </strong>
                                </td>

                                <td></td>

                                <td></td>

                                <td></td>

                                <td>
                                    <span class="badge badge-danger"></span>
                                </td>

                                <td>
                                    <span class="badge badge-warning"></span>
                                </td>

                                <td></td>

                                <td>
                                    ${
                                        rowId
                                            ? `
                                                <div style="display:flex; gap:4px;">
                                                    <button
                                                        class="btn-action btn-view"
                                                        style="padding:4px 8px; font-size:12px; background-color:#0284c7; color:#fff; border:none; border-radius:4px; cursor:pointer;"
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        class="btn-action btn-edit"
                                                        style="padding:4px 8px; font-size:12px; background-color:#f59e0b; color:#fff; border:none; border-radius:4px; cursor:pointer;"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        class="btn-action btn-delete"
                                                        style="padding:4px 8px; font-size:12px; background-color:#dc2626; color:#fff; border:none; border-radius:4px; cursor:pointer;"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            `
                                            : 'N/A'
                                    }
                                </td>
                            `;

                            const tds =
                                tr.querySelectorAll(
                                    'td'
                                );

                            tds[1].textContent =
                                fullName;

                            tds[2].textContent =
                                req.phone_number ||
                                'N/A';

                            tds[3].textContent =
                                req.location ||
                                'N/A';

                            tds[4]
                                .querySelector('span')
                                .textContent =
                                req.emergency_type ||
                                'General';

                            tds[5]
                                .querySelector('span')
                                .textContent =
                                displayTags;

                            tds[6].textContent =
                                req.additional_details ||
                                'None';

                            if (rowId) {

                                tr.querySelector(
                                    '.btn-view'
                                ).addEventListener(
                                    'click',
                                    function () {

                                        openViewModal(
                                            rowId,
                                            fullName,
                                            req.phone_number,
                                            req.location,
                                            req.emergency_type,
                                            displayTags,
                                            req.additional_details
                                        );
                                    }
                                );

                                tr.querySelector(
                                    '.btn-edit'
                                ).addEventListener(
                                    'click',
                                    function () {

                                        openEditModal(
                                            rowId,
                                            fn,
                                            mi,
                                            ln,
                                            req.phone_number,
                                            req.location,
                                            req.emergency_type,
                                            displayTags,
                                            req.additional_details
                                        );
                                    }
                                );

                                tr.querySelector(
                                    '.btn-delete'
                                ).addEventListener(
                                    'click',
                                    function () {
                                        deleteRequest(
                                            rowId
                                        );
                                    }
                                );
                            }

                            tbody.appendChild(
                                tr
                            );
                        }
                    );

                } catch (err) {

                    console.error(
                        'Error loading incidents:',
                        err
                    );
                }
            };

        loadAdminIncidents();

        const passwordInput =
            document.getElementById(
                'password'
            );

        const togglePassword =
            document.getElementById(
                'togglePassword'
            );

        if (
            passwordInput &&
            togglePassword
        ) {

            togglePassword.addEventListener(
                'click',
                function () {

                    const eyeIcon =
                        togglePassword.querySelector(
                            'i'
                        );

                    const isPassword =
                        passwordInput.type ===
                        'password';

                    passwordInput.type =
                        isPassword
                            ? 'text'
                            : 'password';

                    togglePassword.setAttribute(
                        'aria-label',
                        isPassword
                            ? 'Hide password'
                            : 'Show password'
                    );

                    if (eyeIcon) {

                        eyeIcon.classList.toggle(
                            'fa-eye',
                            !isPassword
                        );

                        eyeIcon.classList.toggle(
                            'fa-eye-slash',
                            isPassword
                        );
                    }
                }
            );
        }
    }
);