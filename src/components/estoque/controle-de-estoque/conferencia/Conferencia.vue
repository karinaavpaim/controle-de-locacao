<template>
  <v-app id="conferencia">
    <v-container fluid fill-height>
    </v-container>
  </v-app>
</template>

<script>
export default { name: "Conferencia" };
</script>

<style lang="scss" scoped>
::v-deep .borda-avatar {
  border:1px solid blue;
}

::v-deep .v-btn {
  margin: 6px;
}

::v-deep .v-data-table .v-data-table__wrapper {
  height: 98%;
}

::v-deep .v-data-table.tabela-documentos .v-chip {
  padding: 0 4px 0 4px;
}

::v-deep .v-data-table td, ::v-deep .v-data-table th {
  padding: 0 4px;
}

::v-deep .v-data-table tbody tr:not(.v-data-table__selected),
::v-deep .v-data-table tbody tr:hover:not(.v-data-table__selected):not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: transparent;
}

::v-deep .v-data-table tbody tr.v-data-table__selected,
::v-deep .v-data-table tbody tr.v-data-table__selected:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: #BBDEFB;
}

::v-deep input[type="color"],
::v-deep input[type="date"],
::v-deep input[type="datetime"],
::v-deep input[type="datetime-local"],
::v-deep input[type="email"],
::v-deep input[type="month"],
::v-deep input[type="number"],
::v-deep input[type="password"],
::v-deep input[type="search"],
::v-deep input[type="tel"],
::v-deep input[type="text"],
::v-deep input[type="time"],
::v-deep input[type="url"],
::v-deep input[type="week"],
::v-deep select:focus,
::v-deep textarea {
  font-size: 16px;
}
</style>