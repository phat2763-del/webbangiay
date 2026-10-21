package poly.com.asm.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import poly.com.asm.entity.Category;
import poly.com.asm.service.CategoryService;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class CategoryAControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private CategoryAController categoryAController;

    @BeforeEach
    void setUp() {
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setPrefix("classpath:/templates/");
        viewResolver.setSuffix(".html");

        mockMvc = MockMvcBuilders.standaloneSetup(categoryAController)
                .setViewResolvers(viewResolver)
                .build();
    }

    @Test
    @DisplayName("TC_CAT_01: GET /admin/category/index - Tải trang quản lý danh mục")
    void testIndexNormal() throws Exception {
        when(categoryService.findAll()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/admin/category/index"))
                .andExpect(status().isOk())
                .andExpect(view().name("layout/index"))
                .andExpect(model().attribute("view", "/admin/category.html"))
                .andExpect(model().attributeExists("item"))
                .andExpect(model().attributeExists("items"));
    }

    @Test
    @DisplayName("TC_CAT_02: GET /admin/category/index - Tải trang qua AJAX")
    void testIndexAjax() throws Exception {
        when(categoryService.findAll()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/admin/category/index")
                .header("X-Requested-With", "XMLHttpRequest"))
                .andExpect(status().isOk())
                .andExpect(view().name("admin/category"))
                .andExpect(model().attributeExists("item"))
                .andExpect(model().attributeExists("items"));
    }

    @Test
    @DisplayName("TC_CAT_03: GET /admin/category/edit/{id} - Chỉnh sửa danh mục tồn tại")
    void testEdit() throws Exception {
        Category mockCategory = new Category();
        mockCategory.setId("L01");
        mockCategory.setName("Giày Nam");

        when(categoryService.findById("L01")).thenReturn(mockCategory);
        when(categoryService.findAll()).thenReturn(Collections.singletonList(mockCategory));

        mockMvc.perform(get("/admin/category/edit/L01"))
                .andExpect(status().isOk())
                .andExpect(view().name("layout/index"))
                .andExpect(model().attribute("view", "/admin/category.html"))
                .andExpect(model().attributeExists("item"))
                .andExpect(model().attributeExists("items"));
    }

    @Test
    @DisplayName("TC_CAT_04: POST /admin/category/create - Thêm mới danh mục thành công")
    void testCreateSuccess() throws Exception {
        when(categoryService.findById("L02")).thenReturn(null);
        doNothing().when(categoryService).create(any(Category.class));

        mockMvc.perform(post("/admin/category/create")
                .param("id", "L02")
                .param("name", "Giày Nữ"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/admin/category/index"))
                .andExpect(flash().attributeExists("message"));
    }

    @Test
    @DisplayName("TC_CAT_05: POST /admin/category/create - Thêm mới thất bại do mã đã tồn tại")
    void testCreateDuplicate() throws Exception {
        Category existingCategory = new Category();
        existingCategory.setId("L01");

        when(categoryService.findById("L01")).thenReturn(existingCategory);

        mockMvc.perform(post("/admin/category/create")
                .param("id", "L01")
                .param("name", "Giày Trẻ Em"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/admin/category/index"))
                .andExpect(flash().attributeExists("message"));

        verify(categoryService, never()).create(any(Category.class));
    }

    @Test
    @DisplayName("TC_CAT_06: POST /admin/category/update - Cập nhật danh mục thành công")
    void testUpdateSuccess() throws Exception {
        Category existingCategory = new Category();
        existingCategory.setId("L01");

        when(categoryService.findById("L01")).thenReturn(existingCategory);
        when(categoryService.update(any(Category.class))).thenReturn(existingCategory);

        mockMvc.perform(post("/admin/category/update")
                .param("id", "L01")
                .param("name", "Giày Nam Updated"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/admin/category/index"))
                .andExpect(flash().attributeExists("message"));
    }

    @Test
    @DisplayName("TC_CAT_07: GET /admin/category/delete/{id} - Xóa danh mục thành công")
    void testDeleteSuccess() throws Exception {
        doNothing().when(categoryService).delete("L01");

        mockMvc.perform(get("/admin/category/delete/L01"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/admin/category/index"))
                .andExpect(flash().attributeExists("message"));
    }
}