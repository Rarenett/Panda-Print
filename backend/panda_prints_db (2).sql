-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 28, 2025 at 12:43 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `panda_prints_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_app_company`
--

CREATE TABLE `admin_app_company` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `logo` varchar(100) DEFAULT NULL,
  `website` varchar(200) DEFAULT NULL,
  `contact_email` varchar(254) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `footer_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_app_customer`
--

CREATE TABLE `admin_app_customer` (
  `id` bigint(20) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `profile_picture` varchar(100) DEFAULT NULL,
  `date_joined` datetime(6) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_app_customer`
--

INSERT INTO `admin_app_customer` (`id`, `phone`, `dob`, `profile_picture`, `date_joined`, `user_id`) VALUES
(1, '9876543254', NULL, '', '2025-10-16 18:55:19.047535', 2),
(2, '9876543255', NULL, '', '2025-10-16 18:58:52.265475', 3),
(3, '98765445656', NULL, '', '2025-10-16 19:32:09.643583', 4),
(4, '798654567', NULL, '', '2025-10-16 19:37:13.290470', 5),
(5, '07907132310', NULL, '', '2025-10-27 12:27:28.039533', 6);

-- --------------------------------------------------------

--
-- Table structure for table `admin_app_customuser`
--

CREATE TABLE `admin_app_customuser` (
  `id` bigint(20) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_staff` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_app_customuser`
--

INSERT INTO `admin_app_customuser` (`id`, `password`, `last_login`, `is_superuser`, `name`, `email`, `is_active`, `is_staff`) VALUES
(1, 'pbkdf2_sha256$600000$3kIaof5bPCvZyA7amoQEGX$Yq28Yr+gzz+1HrJi8ANadz5UrPGURkpCV1OIeBTzLes=', '2025-10-16 17:43:25.884304', 1, 'abin', 'ab@gmail.com', 1, 1),
(2, 'pbkdf2_sha256$600000$DCcrlByJrxTQopYZTrenIS$BOOTAZcG90CcWURyRO2+rS2Ycn99eZK0ZId2xeCP37Q=', NULL, 0, 'arjun', 'arjun@gmail.com', 1, 0),
(3, 'pbkdf2_sha256$600000$hMre5UxmO2hEMWUGDYi83I$5hCmpXPfTiiYJr4EnSTPP4My9foXn0sBTli5TyTLQYA=', NULL, 0, 'abhinadh', 'abhinadhmt@gmail.com', 1, 0),
(4, 'pbkdf2_sha256$600000$1nq0TEDl1uwxCz9KQdTYYW$7Lq0G7W+GM57heAi/x133f014brdkuumZDvqO7DCYUs=', NULL, 0, 'aswin', 'aswin@gmail.com', 1, 0),
(5, 'pbkdf2_sha256$600000$fFaHOFko9C0IC1dMYe9N6t$TfGnxZSUs589440j7eGWKdL5oW3/TjE5neZukLO/2ig=', NULL, 0, 'amal', 'amal@gmail.com', 1, 0),
(6, 'pbkdf2_sha256$600000$bOlpBnIc4JuHa33WD4quOJ$fifBnD+kFrXUpRCLPZ5XIjHQogw2iJ7P+YPjj4bL/24=', NULL, 0, 'Vishak M', 'vishak7034@gmaiil.com', 1, 0),
(7, 'pbkdf2_sha256$600000$qRdAtJ1W8dviSbLb9Gf1YJ$QABZCpSMBsZz04EG3y8bZu+7KeX7QAzSIpJCW6q2EZo=', '2025-10-28 09:58:28.860199', 0, 'VISHAK M', 'vishak@gmail.com', 1, 0),
(8, 'pbkdf2_sha256$600000$307aJFwq9EwcPbyJQqwOeX$2XGEGTME+eCmPMdT98ZUKw0RjSlJmgLrX2HBARRQ7Ps=', '2025-10-28 12:00:18.420892', 1, 'admin', 'admin@gmail.com', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `admin_app_customuser_groups`
--

CREATE TABLE `admin_app_customuser_groups` (
  `id` bigint(20) NOT NULL,
  `customuser_id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_app_customuser_user_permissions`
--

CREATE TABLE `admin_app_customuser_user_permissions` (
  `id` bigint(20) NOT NULL,
  `customuser_id` bigint(20) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_app_department`
--

CREATE TABLE `admin_app_department` (
  `id` bigint(20) NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `description` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_app_department`
--

INSERT INTO `admin_app_department` (`id`, `department_name`, `description`) VALUES
(1, 'Production', '');

-- --------------------------------------------------------

--
-- Table structure for table `admin_app_designation`
--

CREATE TABLE `admin_app_designation` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` longtext DEFAULT NULL,
  `department_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_app_designation`
--

INSERT INTO `admin_app_designation` (`id`, `name`, `description`, `department_id`) VALUES
(1, 'Manager', 'nill', 1);

-- --------------------------------------------------------

--
-- Table structure for table `admin_app_menu`
--

CREATE TABLE `admin_app_menu` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_app_menu`
--

INSERT INTO `admin_app_menu` (`id`, `name`, `icon`) VALUES
(2, 'Product', 'fa fa-sitemap'),
(3, 'Master', 'fa fa-sitemap'),
(4, 'Content Management', 'fa fa-sitemap');

-- --------------------------------------------------------

--
-- Table structure for table `admin_app_menupermission`
--

CREATE TABLE `admin_app_menupermission` (
  `id` bigint(20) NOT NULL,
  `submenu_id` bigint(20) NOT NULL,
  `user_profile_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_app_menupermission`
--

INSERT INTO `admin_app_menupermission` (`id`, `submenu_id`, `user_profile_id`) VALUES
(1, 2, 1),
(2, 3, 1),
(3, 4, 1),
(4, 8, 1),
(5, 9, 1);

-- --------------------------------------------------------

--
-- Table structure for table `admin_app_submenu`
--

CREATE TABLE `admin_app_submenu` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `menu_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_app_submenu`
--

INSERT INTO `admin_app_submenu` (`id`, `name`, `url`, `menu_id`) VALUES
(2, 'Category', 'category_listings', 2),
(3, 'Product Type', 'product_listings', 2),
(4, 'Material', 'material_list', 2),
(5, 'Customization', 'customization_list', 2),
(6, 'Field Option', 'field_option_list', 2),
(7, 'Product Image', 'image_list', 2),
(8, 'Department', 'department_hierarchy', 3),
(9, 'Designation', 'designation_list', 3),
(10, 'Users List', 'user_list', 3),
(11, 'Flash Sale', 'flash_sale_list', 4),
(12, 'Most Popular', 'most_popular_list', 4);

-- --------------------------------------------------------

--
-- Table structure for table `admin_app_userprofile`
--

CREATE TABLE `admin_app_userprofile` (
  `id` bigint(20) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `profile_picture` varchar(100) DEFAULT NULL,
  `department_id` bigint(20) DEFAULT NULL,
  `designation_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_app_userprofile`
--

INSERT INTO `admin_app_userprofile` (`id`, `phone`, `profile_picture`, `department_id`, `designation_id`, `user_id`) VALUES
(1, '07907132310', 'profile_pics/tes.jpg', 1, 1, 7);

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add user', 4, 'add_user'),
(14, 'Can change user', 4, 'change_user'),
(15, 'Can delete user', 4, 'delete_user'),
(16, 'Can view user', 4, 'view_user'),
(17, 'Can add content type', 5, 'add_contenttype'),
(18, 'Can change content type', 5, 'change_contenttype'),
(19, 'Can delete content type', 5, 'delete_contenttype'),
(20, 'Can view content type', 5, 'view_contenttype'),
(21, 'Can add session', 6, 'add_session'),
(22, 'Can change session', 6, 'change_session'),
(23, 'Can delete session', 6, 'delete_session'),
(24, 'Can view session', 6, 'view_session'),
(25, 'Can add product category', 7, 'add_productcategory'),
(26, 'Can change product category', 7, 'change_productcategory'),
(27, 'Can delete product category', 7, 'delete_productcategory'),
(28, 'Can view product category', 7, 'view_productcategory'),
(29, 'Can add product type', 8, 'add_producttype'),
(30, 'Can change product type', 8, 'change_producttype'),
(31, 'Can delete product type', 8, 'delete_producttype'),
(32, 'Can view product type', 8, 'view_producttype'),
(33, 'Can add employee', 9, 'add_employee'),
(34, 'Can change employee', 9, 'change_employee'),
(35, 'Can delete employee', 9, 'delete_employee'),
(36, 'Can view employee', 9, 'view_employee'),
(37, 'Can add custom user', 10, 'add_customuser'),
(38, 'Can change custom user', 10, 'change_customuser'),
(39, 'Can delete custom user', 10, 'delete_customuser'),
(40, 'Can view custom user', 10, 'view_customuser'),
(41, 'Can add customer', 11, 'add_customer'),
(42, 'Can change customer', 11, 'change_customer'),
(43, 'Can delete customer', 11, 'delete_customer'),
(44, 'Can view customer', 11, 'view_customer'),
(45, 'Can add product image', 12, 'add_productimage'),
(46, 'Can change product image', 12, 'change_productimage'),
(47, 'Can delete product image', 12, 'delete_productimage'),
(48, 'Can view product image', 12, 'view_productimage'),
(49, 'Can add material', 13, 'add_material'),
(50, 'Can change material', 13, 'change_material'),
(51, 'Can delete material', 13, 'delete_material'),
(52, 'Can view material', 13, 'view_material'),
(53, 'Can add customization field', 14, 'add_customizationfield'),
(54, 'Can change customization field', 14, 'change_customizationfield'),
(55, 'Can delete customization field', 14, 'delete_customizationfield'),
(56, 'Can view customization field', 14, 'view_customizationfield'),
(57, 'Can add field option', 15, 'add_fieldoption'),
(58, 'Can change field option', 15, 'change_fieldoption'),
(59, 'Can delete field option', 15, 'delete_fieldoption'),
(60, 'Can view field option', 15, 'view_fieldoption'),
(61, 'Can add product configuration', 16, 'add_productconfiguration'),
(62, 'Can change product configuration', 16, 'change_productconfiguration'),
(63, 'Can delete product configuration', 16, 'delete_productconfiguration'),
(64, 'Can view product configuration', 16, 'view_productconfiguration'),
(65, 'Can add flash sale', 17, 'add_flashsale'),
(66, 'Can change flash sale', 17, 'change_flashsale'),
(67, 'Can delete flash sale', 17, 'delete_flashsale'),
(68, 'Can view flash sale', 17, 'view_flashsale'),
(69, 'Can add most popular', 18, 'add_mostpopular'),
(70, 'Can change most popular', 18, 'change_mostpopular'),
(71, 'Can delete most popular', 18, 'delete_mostpopular'),
(72, 'Can view most popular', 18, 'view_mostpopular'),
(73, 'Can add company', 19, 'add_company'),
(74, 'Can change company', 19, 'change_company'),
(75, 'Can delete company', 19, 'delete_company'),
(76, 'Can view company', 19, 'view_company'),
(77, 'Can add department', 20, 'add_department'),
(78, 'Can change department', 20, 'change_department'),
(79, 'Can delete department', 20, 'delete_department'),
(80, 'Can view department', 20, 'view_department'),
(81, 'Can add user profile', 21, 'add_userprofile'),
(82, 'Can change user profile', 21, 'change_userprofile'),
(83, 'Can delete user profile', 21, 'delete_userprofile'),
(84, 'Can view user profile', 21, 'view_userprofile'),
(85, 'Can add designation', 22, 'add_designation'),
(86, 'Can change designation', 22, 'change_designation'),
(87, 'Can delete designation', 22, 'delete_designation'),
(88, 'Can view designation', 22, 'view_designation'),
(89, 'Can add menu', 23, 'add_menu'),
(90, 'Can change menu', 23, 'change_menu'),
(91, 'Can delete menu', 23, 'delete_menu'),
(92, 'Can view menu', 23, 'view_menu'),
(93, 'Can add sub menu', 24, 'add_submenu'),
(94, 'Can change sub menu', 24, 'change_submenu'),
(95, 'Can delete sub menu', 24, 'delete_submenu'),
(96, 'Can view sub menu', 24, 'view_submenu'),
(97, 'Can add sub menu permission', 25, 'add_submenupermission'),
(98, 'Can change sub menu permission', 25, 'change_submenupermission'),
(99, 'Can delete sub menu permission', 25, 'delete_submenupermission'),
(100, 'Can view sub menu permission', 25, 'view_submenupermission'),
(101, 'Can add menu permission', 26, 'add_menupermission'),
(102, 'Can change menu permission', 26, 'change_menupermission'),
(103, 'Can delete menu permission', 26, 'delete_menupermission'),
(104, 'Can view menu permission', 26, 'view_menupermission');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user`
--

CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_groups`
--

CREATE TABLE `auth_user_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_user_permissions`
--

CREATE TABLE `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(19, 'admin_app', 'company'),
(11, 'admin_app', 'customer'),
(10, 'admin_app', 'customuser'),
(20, 'admin_app', 'department'),
(22, 'admin_app', 'designation'),
(23, 'admin_app', 'menu'),
(26, 'admin_app', 'menupermission'),
(24, 'admin_app', 'submenu'),
(25, 'admin_app', 'submenupermission'),
(21, 'admin_app', 'userprofile'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'auth', 'user'),
(5, 'contenttypes', 'contenttype'),
(14, 'product_app', 'customizationfield'),
(9, 'product_app', 'employee'),
(15, 'product_app', 'fieldoption'),
(17, 'product_app', 'flashsale'),
(13, 'product_app', 'material'),
(18, 'product_app', 'mostpopular'),
(7, 'product_app', 'productcategory'),
(16, 'product_app', 'productconfiguration'),
(12, 'product_app', 'productimage'),
(8, 'product_app', 'producttype'),
(6, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2025-10-16 17:13:56.110235'),
(2, 'contenttypes', '0002_remove_content_type_name', '2025-10-16 17:13:56.126926'),
(3, 'auth', '0001_initial', '2025-10-16 17:13:56.131922'),
(4, 'auth', '0002_alter_permission_name_max_length', '2025-10-16 17:13:56.136931'),
(5, 'auth', '0003_alter_user_email_max_length', '2025-10-16 17:13:56.141921'),
(6, 'auth', '0004_alter_user_username_opts', '2025-10-16 17:13:56.145759'),
(7, 'auth', '0005_alter_user_last_login_null', '2025-10-16 17:13:56.149806'),
(8, 'auth', '0006_require_contenttypes_0002', '2025-10-16 17:13:56.155757'),
(9, 'auth', '0007_alter_validators_add_error_messages', '2025-10-16 17:13:56.159767'),
(10, 'auth', '0008_alter_user_username_max_length', '2025-10-16 17:13:56.164840'),
(11, 'auth', '0009_alter_user_last_name_max_length', '2025-10-16 17:13:56.168849'),
(12, 'auth', '0010_alter_group_name_max_length', '2025-10-16 17:13:56.172843'),
(13, 'auth', '0011_update_proxy_permissions', '2025-10-16 17:13:56.177840'),
(14, 'auth', '0012_alter_user_first_name_max_length', '2025-10-16 17:13:56.181815'),
(15, 'admin_app', '0001_initial', '2025-10-16 17:13:56.185824'),
(16, 'admin', '0001_initial', '2025-10-16 17:13:56.189842'),
(17, 'admin', '0002_logentry_remove_auto_add', '2025-10-16 17:13:56.194852'),
(18, 'admin', '0003_logentry_add_action_flag_choices', '2025-10-16 17:13:56.198861'),
(19, 'product_app', '0001_initial', '2025-10-16 17:13:56.204470'),
(20, 'product_app', '0002_employee', '2025-10-16 17:13:56.208609'),
(21, 'sessions', '0001_initial', '2025-10-16 17:13:56.213606'),
(22, 'product_app', '0003_material_productimage_customizationfield', '2025-10-19 18:23:53.578451'),
(23, 'product_app', '0004_alter_customizationfield_display_order_and_more', '2025-10-19 19:10:06.980341'),
(24, 'product_app', '0005_producttype_image', '2025-10-20 05:13:18.808020'),
(25, 'product_app', '0006_productconfiguration_fieldoption', '2025-10-21 09:50:09.962360'),
(26, 'product_app', '0007_mostpopular_flashsale', '2025-10-23 05:09:25.076242'),
(27, 'admin_app', '0002_company_department_designation_userprofile', '2025-10-27 16:09:31.128712'),
(28, 'admin_app', '0003_menu_submenu_submenupermission', '2025-10-27 16:59:11.742209'),
(29, 'admin_app', '0004_menupermission_delete_submenupermission', '2025-10-27 17:39:52.848874');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_session`
--

INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
('dulcgs06w89xznogjdwesna3qzeep6cj', '.eJxVjDsOwjAQBe_iGllh_cOU9DmDtZtd4wCypXwqxN1JpBTQzsx7b5VwXUpaZ5nSyOqqgjr9MsLhKXUX_MB6b3podZlG0nuiDzvrvrG8bkf7d1BwLtv6nB15DtG5gODspWOizjswBjLYgEGiBeosiIChsEEfWVzOHqNh49XnC8gfN08:1vDaXy:Mm7h8L2YpAGL6b2i3NuGwYOTjUIM8NBBcducygZqK3k', '2025-11-11 09:08:58.317040'),
('noidle3z075id375a2oglu70xxywxj2k', '.eJxVjEEOwiAQRe_C2hCmULAu3fcMZIYBqRpISrsy3l1JutDVT_57eS_hcd-y31tc_cLiIkCcfj_C8IilA75juVUZatnWhWRX5EGbnCvH5_Vw_wIZW-5Zaxh4sBy-45iByGkg7UZl4nR2SRsepsAWYyIGG0GNgbXSyVBCY8X7A_OhOIE:1v9S0b:WSD6aHv11-go_BpQlufoiKCfUdshesIx_ECZ1MbV_IY', '2025-10-30 17:43:25.890678'),
('s9z6sqt516dtrw83ztdf91gksisvou8m', '.eJxVjDsOwjAQBe_iGllh_cOU9DmDtZtd4wCypXwqxN1JpBTQzsx7b5VwXUpaZ5nSyOqqgjr9MsLhKXUX_MB6b3podZlG0nuiDzvrvrG8bkf7d1BwLtv6nB15DtG5gODspWOizjswBjLYgEGiBeosiIChsEEfWVzOHqNh49XnC8gfN08:1vDKg8:AQV-0SfrLL6Z378MFYyhMcLDvUmYyGBpj6AO4KCgyyo', '2025-11-10 16:12:20.613397'),
('vzk9vs4ckvw1xm8y5d3tiq21wyh8omj9', '.eJxVjDsOwjAQRO_iGlnrT4hDSZ8zWLvrBQeQLcVJhbg7iZQCypn3Zt4q4rrkuDaZ45TURQV1-u0I-SllB-mB5V4117LME-ld0QdteqxJXtfD_TvI2PK2luA8sk_WOHI4WA_gib1DBiNwQ4KOxAzoje3AmNBvialPEs5ALEl9vuKuOC8:1vDdDm:L8L44Sew44BZIrYy-Wruvj1x5IXk6RKQrjB9KJa_cpU', '2025-11-11 12:00:18.427944');

-- --------------------------------------------------------

--
-- Table structure for table `product_app_customizationfield`
--

CREATE TABLE `product_app_customizationfield` (
  `id` bigint(20) NOT NULL,
  `field_name` varchar(100) NOT NULL,
  `field_type` varchar(50) NOT NULL,
  `is_required` tinyint(1) NOT NULL,
  `display_order` int(11) NOT NULL,
  `material_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_app_customizationfield`
--

INSERT INTO `product_app_customizationfield` (`id`, `field_name`, `field_type`, `is_required`, `display_order`, `material_id`) VALUES
(5, 'Thickness', 'DROPDOWN', 1, 0, 4),
(6, 'Edge Finish', 'DROPDOWN', 1, 3, 5),
(7, 'Edge Finish', 'DROPDOWN', 1, 4, 4),
(9, 'Printed Sides', 'DROPDOWN', 1, 3, 4),
(10, 'Grommets', 'DROPDOWN', 1, 4, 4),
(11, 'Pole Pockets', 'DROPDOWN', 1, 5, 4),
(12, 'Accessories', 'DROPDOWN', 1, 5, 4);

-- --------------------------------------------------------

--
-- Table structure for table `product_app_employee`
--

CREATE TABLE `product_app_employee` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `age` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_app_employee`
--

INSERT INTO `product_app_employee` (`id`, `name`, `age`) VALUES
(1, 'arjun', 20);

-- --------------------------------------------------------

--
-- Table structure for table `product_app_fieldoption`
--

CREATE TABLE `product_app_fieldoption` (
  `id` int(11) NOT NULL,
  `value` varchar(100) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `price_modifier_flat` decimal(10,2) NOT NULL,
  `price_modifier_percent` decimal(5,2) NOT NULL,
  `option_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`option_data`)),
  `field_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_app_fieldoption`
--

INSERT INTO `product_app_fieldoption` (`id`, `value`, `image`, `price_modifier_flat`, `price_modifier_percent`, `option_data`, `field_id`) VALUES
(1, '13 oz Vinyl', '', 0.00, 0.00, NULL, 5),
(2, '18 oz Vinyl', '', 30.00, 0.00, NULL, 5),
(3, 'Welded Hem', '', 8.00, 0.00, NULL, 7),
(4, 'Sewn Hem', '', 0.00, 0.00, NULL, 6),
(5, 'Sewn Hem', '', 5.00, 0.00, NULL, 7),
(6, 'None (Flush Cut)', '', 0.00, 0.00, NULL, 7),
(7, 'Single Sided', '', 5.00, 0.00, NULL, 9),
(8, 'Double Sided', '', 10.00, 0.00, NULL, 9),
(9, 'Every 2-3 ft', NULL, 15.00, 0.00, NULL, 10),
(10, 'Every 12-18 in', NULL, 25.00, 0.00, NULL, 10),
(11, '4 Corners', NULL, 5.00, 0.00, NULL, 10),
(12, 'Top Corners Only', NULL, 3.00, 0.00, NULL, 10),
(13, 'None', NULL, 0.00, 0.00, NULL, 10),
(14, 'None', NULL, 0.00, 0.00, NULL, 11),
(15, '3\" Pockets (Top & Bottom)', NULL, 22.00, 0.00, NULL, 11),
(16, '3\" Pocket (Top Only)', NULL, 12.00, 0.00, NULL, 11),
(17, 'None', NULL, 0.00, 0.00, NULL, 12),
(18, 'Bungees (8)', NULL, 12.00, 0.00, NULL, 12),
(19, 'Zip Ties (10)', NULL, 5.00, 0.00, NULL, 12),
(20, '10ft Nylon Rope (4)', NULL, 8.00, 0.00, NULL, 12),
(21, 'Hanging Clips (6)', NULL, 10.00, 0.00, NULL, 12),
(22, '1.75\" Suction Cups (8)', NULL, 15.00, 0.00, NULL, 12),
(23, 'Velcro (12)', NULL, 18.00, 0.00, NULL, 12);

-- --------------------------------------------------------

--
-- Table structure for table `product_app_flashsale`
--

CREATE TABLE `product_app_flashsale` (
  `id` bigint(20) NOT NULL,
  `sale_title` varchar(100) NOT NULL,
  `discount_percentage` int(10) UNSIGNED NOT NULL CHECK (`discount_percentage` >= 0),
  `start_time` datetime(6) NOT NULL,
  `end_time` datetime(6) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `display_order` int(11) NOT NULL,
  `material_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_app_flashsale`
--

INSERT INTO `product_app_flashsale` (`id`, `sale_title`, `discount_percentage`, `start_time`, `end_time`, `is_active`, `display_order`, `material_id`) VALUES
(1, 'popular', 20, '2025-10-23 12:02:30.000000', '2025-10-28 13:02:30.000000', 1, 0, 6),
(3, 'no', 20, '2025-10-23 12:02:30.000000', '2025-10-27 13:02:30.000000', 1, 2, 22),
(4, 'nk', 0, '2025-10-23 12:02:30.000000', '2025-10-30 13:02:30.000000', 1, 0, 19),
(5, 'jhvk', 0, '2025-10-23 12:02:30.000000', '2025-10-25 13:02:30.000000', 1, 2, 23),
(6, 'jhv', 30, '2025-10-23 12:02:30.000000', '2025-10-25 13:02:30.000000', 1, 4, 20);

-- --------------------------------------------------------

--
-- Table structure for table `product_app_material`
--

CREATE TABLE `product_app_material` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `image_swatch` varchar(100) DEFAULT NULL,
  `material_cost_per_sqft` decimal(10,4) NOT NULL,
  `product_type_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_app_material`
--

INSERT INTO `product_app_material` (`id`, `name`, `image_swatch`, `material_cost_per_sqft`, `product_type_id`) VALUES
(4, 'Vinyl Banners', 'swatches/vinylbanners1.jpg', 5.0000, 9),
(5, 'Fabric Banners', 'swatches/fabricbanner1.jpg', 6.0000, 9),
(6, 'Mesh Banners', 'swatches/Mesh-banner.jpg', 5.5000, 9),
(7, 'Pole Banners', 'swatches/Pole-Banners.jpg', 7.2500, 9),
(8, 'Fence Banners', 'swatches/Fence-banner.jpg', 6.0000, 9),
(9, 'Breakaway Banners', 'swatches/Breakaway-banner.jpg', 8.5000, 9),
(10, 'Sports Team Banners', 'swatches/sports-banner.jpg', 7.7500, 9),
(11, 'Senior Sports Banners', 'swatches/senior_sports.png', 6.5000, 9),
(12, 'Retractable Banners', 'swatches/retractable-banners.jpg', 7.5000, 10),
(15, 'Step & Repeat Banners', 'swatches/Step_And_Repeat_Banner.jpg', 9.7500, 10),
(16, 'Backdrops', 'swatches/backdrops.jpg', 8.5000, 10),
(17, 'X-Banners', 'swatches/X_Banner_Stands_Main_Image.png', 5.2500, 10),
(18, 'Table Top Retractable Banners', 'swatches/Tabletop-Retractable-Banners-SQS-10560.jpg', 6.7500, 10),
(19, 'Feather Flag Banners', 'swatches/Feather-flags-SQS-10024.jpg', 7.2500, 11),
(20, 'Angled Flag Banners', 'swatches/Angled-flags-SQS-9960.jpg', 6.7500, 11),
(21, 'Rectangle Flag Banners', 'swatches/Rectangle-flags-SQS-10524_1.jpg', 8.0000, 11),
(22, 'Teardrop Flag Banners', 'swatches/teardrop.jpg', 7.5000, 11),
(23, 'Aluminum Signs', 'swatches/Aluminum-signs.jpg', 5.5000, 12),
(24, 'Brushed Aluminum', 'swatches/brushed-aluminum-.jpg', 8.2500, 12),
(25, 'Reflective Aluminum', 'swatches/Reflective-aluminum-.jpg', 6.7500, 12),
(26, 'Standard A-Frame', 'swatches/A-Frames-standard_cngECSL.jpg', 5.7500, 13),
(27, 'Premium A-Frame', 'swatches/A-Frames-standard.jpg', 7.5000, 13),
(28, 'Dry Erase A-Frame', 'swatches/Dry_Erase_Signicade_A-Frame_Food_and_Beverage_Marketing_Material_A.jpg', 9.0000, 13),
(29, 'Real Estate A-Frame', 'swatches/realestateaframes.jpg', 8.2500, 13),
(30, 'Custom Flags', 'swatches/Custom-Flags-Vibrant-Print-Quality-with-Fade-Resistant-Ink-13702.jpg', 6.0000, 14),
(31, 'Standard Table Cover', 'swatches/Table-Covers-AL-Hero-10927.jpg', 4.0000, 15),
(32, 'Vinyl Lettering', 'swatches/Vinyl-lettering-storefront-sqs-10512.jpg', 5.0000, 16),
(33, 'Promotional Magnets', 'swatches/Promotional-Magnets-0016-Business-card-style-magnet-10916.jpg', 7.0000, 18);

-- --------------------------------------------------------

--
-- Table structure for table `product_app_mostpopular`
--

CREATE TABLE `product_app_mostpopular` (
  `id` bigint(20) NOT NULL,
  `title` varchar(100) NOT NULL,
  `badge` varchar(50) DEFAULT NULL,
  `sale_percentage` int(10) UNSIGNED NOT NULL CHECK (`sale_percentage` >= 0),
  `display_order` int(11) NOT NULL,
  `material_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_app_mostpopular`
--

INSERT INTO `product_app_mostpopular` (`id`, `title`, `badge`, `sale_percentage`, `display_order`, `material_id`) VALUES
(1, 'Trending one', 'Trending', 10, 1, 4),
(2, 'nil', 'Top Pick', 10, 0, 28),
(3, 'any', 'Trending', 20, 3, 19),
(4, 'nil', 'Best', 0, 4, 8),
(5, 'nil', 'Best', 30, 2, 7);

-- --------------------------------------------------------

--
-- Table structure for table `product_app_productcategory`
--

CREATE TABLE `product_app_productcategory` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `display_order` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_app_productcategory`
--

INSERT INTO `product_app_productcategory` (`id`, `name`, `slug`, `display_order`) VALUES
(12, 'Signs', 'signs', 1),
(14, 'Banners', 'banners', 0),
(15, 'Decals', 'decals', 3),
(16, 'Magnets', 'magnets', 4),
(18, 'Prints', 'prints', 6),
(19, 'Flags & Fabrics', 'fabric', 2),
(20, 'Posters', 'posters', 7),
(22, 'More', 'more', 10);

-- --------------------------------------------------------

--
-- Table structure for table `product_app_productconfiguration`
--

CREATE TABLE `product_app_productconfiguration` (
  `id` int(11) NOT NULL,
  `width_inches` decimal(6,2) NOT NULL,
  `height_inches` decimal(6,2) NOT NULL,
  `config_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`config_details`)),
  `calculated_unit_price` decimal(10,2) NOT NULL,
  `material_id` bigint(20) NOT NULL,
  `product_type_id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_app_productimage`
--

CREATE TABLE `product_app_productimage` (
  `id` bigint(20) NOT NULL,
  `image_file` varchar(100) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `display_order` int(11) NOT NULL,
  `material_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_app_productimage`
--

INSERT INTO `product_app_productimage` (`id`, `image_file`, `role`, `caption`, `display_order`, `material_id`) VALUES
(2, 'gallery/2.jpg', 'Main', 'Main Image', 0, 4),
(3, 'gallery/vinylbanners2.jpg', 'Main 2', 'Main Image 2', 1, 4),
(4, 'gallery/fabricbanner1.jpg', 'main', 'main image', 2, 5);

-- --------------------------------------------------------

--
-- Table structure for table `product_app_producttype`
--

CREATE TABLE `product_app_producttype` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `base_unit_cost` decimal(10,4) NOT NULL,
  `is_custom_size` tinyint(1) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  `image` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_app_producttype`
--

INSERT INTO `product_app_producttype` (`id`, `name`, `base_unit_cost`, `is_custom_size`, `category_id`, `image`) VALUES
(9, 'Custom Banners', 58.0300, 1, 14, 'product_types/30.png'),
(10, 'Banner Stands', 113.0000, 1, 14, 'product_types/20.png'),
(11, 'Flag Banners', 150.0000, 1, 14, 'product_types/11.png'),
(12, 'Metal Signs', 80.0000, 1, 12, 'product_types/24.png'),
(13, 'A Frame Signs', 173.0000, 1, 12, 'product_types/2.png'),
(14, 'Traditional Flags', 24.0000, 1, 19, 'product_types/8.png'),
(15, 'Tablecloths', 12.0000, 1, 19, 'product_types/26.png'),
(16, 'Vinyl Lettering', 5.0000, 1, 15, 'product_types/31.png'),
(17, 'Window Decals', 12.0000, 1, 15, 'product_types/33.png'),
(18, 'Magnets', 10.0000, 1, 16, 'product_types/16.png'),
(19, 'Prints', 50.0000, 1, 18, 'product_types/6.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_app_company`
--
ALTER TABLE `admin_app_company`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admin_app_customer`
--
ALTER TABLE `admin_app_customer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `admin_app_customuser`
--
ALTER TABLE `admin_app_customuser`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `admin_app_customuser_groups`
--
ALTER TABLE `admin_app_customuser_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admin_app_customuser_groups_customuser_id_group_id_e5a4d2c7_uniq` (`customuser_id`,`group_id`),
  ADD KEY `admin_app_customuser_groups_group_id_c51f592c_fk_auth_group_id` (`group_id`);

--
-- Indexes for table `admin_app_customuser_user_permissions`
--
ALTER TABLE `admin_app_customuser_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admin_app_customuser_use_customuser_id_permission_ac05d33d_uniq` (`customuser_id`,`permission_id`),
  ADD KEY `admin_app_customuser_permission_id_bd8139a1_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `admin_app_department`
--
ALTER TABLE `admin_app_department`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `department_name` (`department_name`);

--
-- Indexes for table `admin_app_designation`
--
ALTER TABLE `admin_app_designation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_app_designatio_department_id_8e0a3b37_fk_admin_app` (`department_id`);

--
-- Indexes for table `admin_app_menu`
--
ALTER TABLE `admin_app_menu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admin_app_menupermission`
--
ALTER TABLE `admin_app_menupermission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admin_app_menupermission_user_profile_id_submenu__e6a8b9e7_uniq` (`user_profile_id`,`submenu_id`),
  ADD KEY `admin_app_menupermis_submenu_id_d06bea7a_fk_admin_app` (`submenu_id`);

--
-- Indexes for table `admin_app_submenu`
--
ALTER TABLE `admin_app_submenu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_app_submenu_menu_id_85c67763_fk_admin_app_menu_id` (`menu_id`);

--
-- Indexes for table `admin_app_userprofile`
--
ALTER TABLE `admin_app_userprofile`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `admin_app_userprofil_department_id_055ea062_fk_admin_app` (`department_id`),
  ADD KEY `admin_app_userprofil_designation_id_4bd0968c_fk_admin_app` (`designation_id`);

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indexes for table `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  ADD KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`);

--
-- Indexes for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  ADD KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`);

--
-- Indexes for table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indexes for table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Indexes for table `product_app_customizationfield`
--
ALTER TABLE `product_app_customizationfield`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_app_customizatio_material_id_field_name_a9c95426_uniq` (`material_id`,`field_name`);

--
-- Indexes for table `product_app_employee`
--
ALTER TABLE `product_app_employee`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_app_fieldoption`
--
ALTER TABLE `product_app_fieldoption`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_app_fieldopt_field_id_63c9c5d8_fk_product_a` (`field_id`);

--
-- Indexes for table `product_app_flashsale`
--
ALTER TABLE `product_app_flashsale`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_app_flashsal_material_id_ad338715_fk_product_a` (`material_id`);

--
-- Indexes for table `product_app_material`
--
ALTER TABLE `product_app_material`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_app_material_product_type_id_a5ada11f_fk_product_a` (`product_type_id`);

--
-- Indexes for table `product_app_mostpopular`
--
ALTER TABLE `product_app_mostpopular`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_app_mostpopu_material_id_01bc4eb4_fk_product_a` (`material_id`);

--
-- Indexes for table `product_app_productcategory`
--
ALTER TABLE `product_app_productcategory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `product_app_productconfiguration`
--
ALTER TABLE `product_app_productconfiguration`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_app_productc_material_id_3ba50f97_fk_product_a` (`material_id`),
  ADD KEY `product_app_productc_product_type_id_938cca4e_fk_product_a` (`product_type_id`),
  ADD KEY `product_app_productc_user_id_cb506e3c_fk_admin_app` (`user_id`);

--
-- Indexes for table `product_app_productimage`
--
ALTER TABLE `product_app_productimage`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_app_productimage_material_id_role_d568f8b7_uniq` (`material_id`,`role`);

--
-- Indexes for table `product_app_producttype`
--
ALTER TABLE `product_app_producttype`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_app_productt_category_id_8adc4d9b_fk_product_a` (`category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_app_company`
--
ALTER TABLE `admin_app_company`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin_app_customer`
--
ALTER TABLE `admin_app_customer`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `admin_app_customuser`
--
ALTER TABLE `admin_app_customuser`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `admin_app_customuser_groups`
--
ALTER TABLE `admin_app_customuser_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin_app_customuser_user_permissions`
--
ALTER TABLE `admin_app_customuser_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin_app_department`
--
ALTER TABLE `admin_app_department`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admin_app_designation`
--
ALTER TABLE `admin_app_designation`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admin_app_menu`
--
ALTER TABLE `admin_app_menu`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `admin_app_menupermission`
--
ALTER TABLE `admin_app_menupermission`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `admin_app_submenu`
--
ALTER TABLE `admin_app_submenu`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `admin_app_userprofile`
--
ALTER TABLE `admin_app_userprofile`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `product_app_customizationfield`
--
ALTER TABLE `product_app_customizationfield`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `product_app_employee`
--
ALTER TABLE `product_app_employee`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `product_app_fieldoption`
--
ALTER TABLE `product_app_fieldoption`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `product_app_flashsale`
--
ALTER TABLE `product_app_flashsale`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `product_app_material`
--
ALTER TABLE `product_app_material`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `product_app_mostpopular`
--
ALTER TABLE `product_app_mostpopular`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `product_app_productcategory`
--
ALTER TABLE `product_app_productcategory`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `product_app_productconfiguration`
--
ALTER TABLE `product_app_productconfiguration`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_app_productimage`
--
ALTER TABLE `product_app_productimage`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `product_app_producttype`
--
ALTER TABLE `product_app_producttype`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_app_customer`
--
ALTER TABLE `admin_app_customer`
  ADD CONSTRAINT `admin_app_customer_user_id_18a0d535_fk_admin_app_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `admin_app_customuser` (`id`);

--
-- Constraints for table `admin_app_customuser_groups`
--
ALTER TABLE `admin_app_customuser_groups`
  ADD CONSTRAINT `admin_app_customuser_customuser_id_4f850244_fk_admin_app` FOREIGN KEY (`customuser_id`) REFERENCES `admin_app_customuser` (`id`),
  ADD CONSTRAINT `admin_app_customuser_groups_group_id_c51f592c_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `admin_app_customuser_user_permissions`
--
ALTER TABLE `admin_app_customuser_user_permissions`
  ADD CONSTRAINT `admin_app_customuser_customuser_id_784d2ed6_fk_admin_app` FOREIGN KEY (`customuser_id`) REFERENCES `admin_app_customuser` (`id`),
  ADD CONSTRAINT `admin_app_customuser_permission_id_bd8139a1_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`);

--
-- Constraints for table `admin_app_designation`
--
ALTER TABLE `admin_app_designation`
  ADD CONSTRAINT `admin_app_designatio_department_id_8e0a3b37_fk_admin_app` FOREIGN KEY (`department_id`) REFERENCES `admin_app_department` (`id`);

--
-- Constraints for table `admin_app_menupermission`
--
ALTER TABLE `admin_app_menupermission`
  ADD CONSTRAINT `admin_app_menupermis_submenu_id_d06bea7a_fk_admin_app` FOREIGN KEY (`submenu_id`) REFERENCES `admin_app_submenu` (`id`),
  ADD CONSTRAINT `admin_app_menupermis_user_profile_id_fe2cef56_fk_admin_app` FOREIGN KEY (`user_profile_id`) REFERENCES `admin_app_userprofile` (`id`);

--
-- Constraints for table `admin_app_submenu`
--
ALTER TABLE `admin_app_submenu`
  ADD CONSTRAINT `admin_app_submenu_menu_id_85c67763_fk_admin_app_menu_id` FOREIGN KEY (`menu_id`) REFERENCES `admin_app_menu` (`id`);

--
-- Constraints for table `admin_app_userprofile`
--
ALTER TABLE `admin_app_userprofile`
  ADD CONSTRAINT `admin_app_userprofil_department_id_055ea062_fk_admin_app` FOREIGN KEY (`department_id`) REFERENCES `admin_app_department` (`id`),
  ADD CONSTRAINT `admin_app_userprofil_designation_id_4bd0968c_fk_admin_app` FOREIGN KEY (`designation_id`) REFERENCES `admin_app_designation` (`id`),
  ADD CONSTRAINT `admin_app_userprofil_user_id_aa178df4_fk_admin_app` FOREIGN KEY (`user_id`) REFERENCES `admin_app_customuser` (`id`);

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `product_app_customizationfield`
--
ALTER TABLE `product_app_customizationfield`
  ADD CONSTRAINT `product_app_customiz_material_id_1a4bdd22_fk_product_a` FOREIGN KEY (`material_id`) REFERENCES `product_app_material` (`id`);

--
-- Constraints for table `product_app_fieldoption`
--
ALTER TABLE `product_app_fieldoption`
  ADD CONSTRAINT `product_app_fieldopt_field_id_63c9c5d8_fk_product_a` FOREIGN KEY (`field_id`) REFERENCES `product_app_customizationfield` (`id`);

--
-- Constraints for table `product_app_flashsale`
--
ALTER TABLE `product_app_flashsale`
  ADD CONSTRAINT `product_app_flashsal_material_id_ad338715_fk_product_a` FOREIGN KEY (`material_id`) REFERENCES `product_app_material` (`id`);

--
-- Constraints for table `product_app_material`
--
ALTER TABLE `product_app_material`
  ADD CONSTRAINT `product_app_material_product_type_id_a5ada11f_fk_product_a` FOREIGN KEY (`product_type_id`) REFERENCES `product_app_producttype` (`id`);

--
-- Constraints for table `product_app_mostpopular`
--
ALTER TABLE `product_app_mostpopular`
  ADD CONSTRAINT `product_app_mostpopu_material_id_01bc4eb4_fk_product_a` FOREIGN KEY (`material_id`) REFERENCES `product_app_material` (`id`);

--
-- Constraints for table `product_app_productconfiguration`
--
ALTER TABLE `product_app_productconfiguration`
  ADD CONSTRAINT `product_app_productc_material_id_3ba50f97_fk_product_a` FOREIGN KEY (`material_id`) REFERENCES `product_app_material` (`id`),
  ADD CONSTRAINT `product_app_productc_product_type_id_938cca4e_fk_product_a` FOREIGN KEY (`product_type_id`) REFERENCES `product_app_producttype` (`id`),
  ADD CONSTRAINT `product_app_productc_user_id_cb506e3c_fk_admin_app` FOREIGN KEY (`user_id`) REFERENCES `admin_app_customuser` (`id`);

--
-- Constraints for table `product_app_productimage`
--
ALTER TABLE `product_app_productimage`
  ADD CONSTRAINT `product_app_producti_material_id_01306b80_fk_product_a` FOREIGN KEY (`material_id`) REFERENCES `product_app_material` (`id`);

--
-- Constraints for table `product_app_producttype`
--
ALTER TABLE `product_app_producttype`
  ADD CONSTRAINT `product_app_productt_category_id_8adc4d9b_fk_product_a` FOREIGN KEY (`category_id`) REFERENCES `product_app_productcategory` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
