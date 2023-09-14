<template lang="pug">
div
    form    
        div.row
            div.col
                label(for="updateTitleInput") Update Document Title
                input.form-control(
                    type="text", 
                    id="updateTitleInput", 
                    placeholder="current doc title"
                )
            div.col
                .form-group
                    label(for="updateDescriptionInput") Update Document Description
                    input.form-control(
                        type="text", 
                        id="updateDescriptionInput",
                        placeholder="current doc description"
                    )
button.btn.btn-primary(
                type='button'
                @click=''
            ) Save changes
</template>

<script>
export default {

}
</script>

<style>

</style>