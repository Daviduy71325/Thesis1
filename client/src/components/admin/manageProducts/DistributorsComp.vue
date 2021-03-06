<template>
  <section class="Distributor">
    <b-overlay
      :variant="overlay.variant"
      :opacity="overlay.opacity"
      :blur="overlay.blur"
      :show="overlay.show"
      rounded="sm"
    >
      <div class="row" :aria-hidden="overlay.show ? 'true' : null">
        <div class="col-12">
          <div class="row">
            <div class="col-md-3 mb-2">
              <button class="btn btn-lg btn-success" @click="addDistributor()">
                ADD DISTRIBUTOR
              </button>
            </div>
            <div class="col-md-6">
              <b-form-group
                label="Filter"
                label-for="filter-input"
                label-cols-sm="3"
                label-align-lg="right"
                label-size="lg"
                class="mb-0"
              >
                <b-input-group size="md">
                  <b-form-input
                    v-model="table.filter"
                    type="search"
                    id="filter-input"
                    placeholder="Type to Search Distributor"
                  ></b-form-input>

                  <b-input-group-append>
                    <button
                      :disabled="!table.filter"
                      @click="table.filter = ''"
                      class="btn btn-dark"
                    >
                      Clear
                    </button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </div>
            <b-col sm="5" md="3" class="my-1">
              <b-form-group
                label="Per page"
                label-for="per-page-select"
                label-cols-sm="6"
                label-cols-md="4"
                label-cols-lg="3"
                label-align-sm="left"
                label-size="md"
                class="mb-0"
                style="font-size: 18px;"
              >
                <!-- <label class="perPageLabel">Per page:</label> -->
                <b-form-select
                  id="per-page-select"
                  v-model="table.perPage"
                  :options="table.pageOptions"
                  size="md"
                  class="perPage"
                ></b-form-select>
              </b-form-group>
            </b-col>
          </div>

          <div class="col-md-12">
            <b-table
              class="table mb-2"
              :bordered="table.bordered"
              :hover="true"
              :items="table.distributors"
              :fields="table.fields"
              :head-variant="table.headVariant"
              :filter="table.filter"
              :filter-included-fields="table.filterOn"
              :fixed="table.fixed"
              :per-page="table.perPage"
              :current-page="table.currentPage"
              :busy.sync="table.isBusy"
              primary-key="_id"
              responsive="sm"
              sort-direction="desc"
              :sort-by.sync="table.sortBy"
              :sort-desc.sync="table.sortDesc"
              sort-icon-left
              empty-text="No data to available."
              show-empty
            >
              <template #cell(actions)="row">
                <b-button size="sm" @click="row.toggleDetails">
                  {{ row.detailsShowing ? "Hide" : "Show" }} Details
                </b-button>
                <b-button
                  size="sm"
                  @click="edit(row.item, row.index, $event.target)"
                  class="mr-1"
                >
                  Edit
                </b-button>
              </template>
              <template v-slot:empty="scope">
                <h3 class="text-center">{{ scope.emptyText }}</h3>
              </template>
              <template #row-details="row">
                <b-card>
                  <ul>
                    <li>
                      Distributor :
                      <strong>{{ row.item.distributor_name }}</strong>
                    </li>
                    <li>
                      Address : <strong>{{ row.item.address }}</strong>
                    </li>
                    <li>
                      Contact Number :
                      <strong>{{ row.item.contact_number }}</strong>
                    </li>
                  </ul>
                </b-card>
              </template>
            </b-table>
          </div>
          <b-col cols="5">
            <b-row md="3">
              <b-col cols="12">
                <b-pagination
                  v-model="table.currentPage"
                  :total-rows="rows"
                  :per-page="table.perPage"
                >
                </b-pagination>
              </b-col>
            </b-row>
          </b-col>
        </div>
      </div>
    </b-overlay>
    <b-modal
      hide-footer
      :id="editDistModal.id"
      title="EDIT DISTRIBUTOR INFO"
      @hide="reseteditDistModal"
      ref="editDistModal"
      :header-bg-variant="modal.headerBgVariant"
      :header-text-variant="modal.headerTextVariant"
    >
      <editDistributorComp
        @clicked="editDistSave"
        :distInfoProps="editDistModal.content"
      />
    </b-modal>
    <b-modal
      hide-footer
      :id="addDistModal.id"
      title="ADD DISTRIBUTOR"
      @hide="reseteditDistModal"
      ref="addDistModal"
      :header-bg-variant="modal.headerBgVariant"
      :header-text-variant="modal.headerTextVariant"
    >
      <addDistributorComp
        @clicked="addDistSave"
        :distInfoProps="addDistModal.content"
      />
    </b-modal>
  </section>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters, mapState } from "vuex";
import store from "@/store";
import { mask } from "vue-the-mask";
import axios from "axios";
import router from "../../../router";

import addDistributorComp from "@/components/admin/manageProducts/AddDistributorComp";
import editDistributorComp from "@/components/admin/manageProducts/EditDistributorComp";

export default {
  name: "DistributorsComponent",
  components: { editDistributorComp, addDistributorComp },
  data() {
    return {
      modal: {
        headerBgVariant: "dark",
        headerTextVariant: "light"
      },
      overlay: {
        show: false,
        variant: "transparent",
        opacity: 0.89,
        blur: "2px"
      },
      table: {
        filter: "",
        headVariant: "dark",
        sortDesc: true,
        bordered: true,
        fixed: false,
        perPage: 5,
        currentPage: 1,
        isBusy: false,
        sortBy: "dist_no",
        fields: [
          { key: "dist_no", sortable: true, label: "ID" },
          {
            key: "distributor_name",
            sortable: true,
            label: "Distributors Name"
          },
          // { key: "address", sortable: true, label: "Address" },
          // { key: "contact_number", sortable: true, label: "Contact No." },
          { key: "actions", label: "Actions", thStyle: { width: "20%" } }
        ],
        pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
        distributors: [],
        filterOn: []
      },
      id: "",
      editDistModal: {
        id: "info-modal",
        title: "",
        content: {}
      },
      addDistModal: {
        id: "info-modal",
        title: "",
        content: {}
      },
      isLoading: false,
      loader: "spinner",
      canCancel: false,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
      checkIfActive: false,
      isActive: ""
    };
  },

  computed: {
    rows() {
      return this.table.distributors.length;
    }
  },
  mounted() {
    this.getDistributorsList();
  },
  methods: {
    async getDistributorsList() {
      //pang kuha ng list ng distributors
      this.isBusy = true;

      axios
        .get("http://localhost:5000/api/admin/distributorList")
        .then(({ data }) => {
          this.isBusy = false;
          if (data.distributors.lenght === 0) {
            alert("no data");
          }
          this.table.distributors = data.distributors;
        })
        .catch(err => {
          console.log("may error");
        });
    },

    addDistributor() {
      // this.$root.$emit("bv::show::modal", this.addDistModal.id);
      this.$refs["addDistModal"].show();
    },
    addDistSave() {
      this.$refs["addDistModal"].hide();
      this.overlay.show = true;
      setTimeout(() => {
        this.overlay.show = false;
        this.$toast.success("Successfully Added.", {
          rtl: false,
          timeOut: 2000,
          closeable: true
        });
        this.getDistributorsList();
      }, 2000);
    },
    edit(item, index, button) {
      //lalabas ang modal para maedit ang distributor

      this.editDistModal.title = "INFO";
      this.editDistModal.content = item;
      // this.$root.$emit("bv::show::modal", this.editDistModal.id, button);
      this.$refs["editDistModal"].show();
    },
    reseteditDistModal() {
      this.editDistModal.title = "";
      this.editDistModal.content = "";
    },
    editDistSave(test) {
      this.$refs["editDistModal"].hide();
      this.overlay.show = true;
      setTimeout(() => {
        this.overlay.show = false;
        this.$toast.success("Successfully Edited.", {
          rtl: false,
          timeOut: 2000,
          closeable: true
        });
        this.getDistributorsList();
        this.reseteditDistModal;
      }, 2000);
    }
  }
};
</script>

<style scoped>
.card-title {
  font-size: 27px;
}
.btn-sm {
  padding: 0.5rem 4.81rem;
}
.perPage {
  max-width: 100%;
}
</style>
