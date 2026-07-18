
import { Column, Task, ProjectTemplate } from './types';
import { translations, Language } from './lib/translations';

export const getInitialColumns = (lang: Language = 'de'): Column[] => {
  const t = translations[lang];
  return [
  { id: 'pre-production', title: t.preProduction },
  { id: 'environment', title: t.environmentArt },
  { id: 'logic', title: t.logicVerse },
  { id: 'optimization', title: t.optimizationStage },
  { id: 'release', title: t.playtestingRelease },
];
};

export const getTemplateTasks = (template: ProjectTemplate, lang: Language = 'de'): Task[] => {
  const t = translations[lang];
    
  const baseTasks: Task[] = [
    // Pre-Production
    {
      id: 'task-1',
      columnId: 'pre-production',
      title: t.task_game_loop_core_mecha_0,
      description: t.task_define_the_rules_and_1,
      subTasks: [
        { id: 'st-1-1', title: t.task_set_win_conditions_2, completed: false },
        { id: 'st-1-2', title: t.task_determine_number_of__3, completed: false },
        { id: 'st-1-3', title: t.task_player_count_min_max_4, completed: false },
      ],
      tips: [t.task_keep_it_simple_for_t_5],
      notes: '',
    },
    {
      id: 'task-2',
      columnId: 'pre-production',
      title: t.task_reference_images_moo_6,
      description: t.task_collect_ideas_for_th_7,
      subTasks: [
        { id: 'st-2-1', title: t.task_create_pinterest_art_8, completed: false },
        { id: 'st-2-2', title: t.task_set_color_scheme_9, completed: false },
      ],
      tips: [t.task_colors_create_the_at_10],
      notes: '',
    },
    // Environment & Art
    {
      id: 'task-3',
      columnId: 'environment',
      title: t.task_greyboxing_layout_11,
      description: t.task_block_out_the_level__12,
      subTasks: [
        { id: 'st-3-1', title: t.task_block_main_paths_13, completed: false },
        { id: 'st-3-2', title: t.task_check_lines_of_sight_14, completed: false },
        { id: 'st-3-3', title: t.task_scale_check_with_pla_15, completed: false },
      ],
      tips: [t.task_do_not_detail_yet_ju_16],
      notes: '',
    },
    {
      id: 'task-4',
      columnId: 'environment',
      title: t.task_terrain_sculpting_17,
      description: t.task_landscape_design__18,
      subTasks: [
        { id: 'st-4-1', title: t.task_form_mountains_and_v_19, completed: false },
        { id: 'st-4-2', title: t.task_paint_material_layer_20, completed: false },
      ],
      tips: [t.task_use_the_erosion_tool_21],
      notes: '',
    },
    {
      id: 'task-5',
      columnId: 'environment',
      title: t.task_props_set_dressing_22,
      description: t.task_bring_life_to_the_ma_23,
      subTasks: [
        { id: 'st-5-1', title: t.task_place_main_buildings_24, completed: false },
        { id: 'st-5-2', title: t.task_nature_elements_tree_25, completed: false },
        { id: 'st-5-3', title: t.task_small_details_trash__26, completed: false },
      ],
      tips: [t.task_rotate_and_scale_pro_27],
      notes: '',
    },
    {
      id: 'task-6',
      columnId: 'environment',
      title: t.task_lumen_lighting_sky_l_28,
      description: t.task_global_illumination__29,
      subTasks: [
        { id: 'st-6-1', title: t.task_orient_directional_l_30, completed: false },
        { id: 'st-6-2', title: t.task_adjust_sky_atmospher_31, completed: false },
        { id: 'st-6-3', title: t.task_add_post_process_vol_32, completed: false },
      ],
      tips: [t.task_lighting_changes_the_33],
      notes: '',
    },
    // Logic
    {
      id: 'task-7',
      columnId: 'logic',
      title: t.task_spawnpads_team_setti_34,
      description: t.task_where_players_spawn__35,
      subTasks: [
        { id: 'st-7-1', title: t.task_place_player_spawner_36, completed: false },
        { id: 'st-7-2', title: t.task_team_settings_invent_37, completed: false },
      ],
      tips: [t.task_ensure_spawns_are_fa_38],
      notes: '',
    },
    {
      id: 'task-8',
      columnId: 'logic',
      title: t.task_end_game_condition_s_39,
      description: t.task_when_does_the_game_e_40,
      subTasks: [
        { id: 'st-8-1', title: t.task_configure_end_game_d_41, completed: false },
        { id: 'st-8-2', title: t.task_score_manager_option_42, completed: false },
      ],
      tips: [t.task_check_win_conditions_43],
      notes: '',
    },
    // Optimization
    {
      id: 'task-opt-1',
      columnId: 'optimization',
      title: t.task_generate_hlods_44,
      description: t.task_important_for_perfor_45,
      subTasks: [
        { id: 'st-opt-1-1', title: t.task_divide_level_into_gr_46, completed: false },
        { id: 'st-opt-1-2', title: t.task_assign_hlod_layer_47, completed: false },
        { id: 'st-opt-1-3', title: t.task_click_build_hlods_48, completed: false },
      ],
      tips: [t.task_window_world_partiti_49],
      notes: '',
    },
    {
      id: 'task-opt-2',
      columnId: 'optimization',
      title: t.task_navmesh_rebuild_50,
      description: t.task_update_ai_navigation_51,
      subTasks: [
        { id: 'st-opt-2-1', title: t.task_check_nav_mesh_bound_52, completed: false },
        { id: 'st-opt-2-2', title: t.task_press_p_to_visualize_53, completed: false },
      ],
      tips: [t.task_crucial_for_guards_a_54],
      notes: '',
    },
    {
      id: 'task-opt-3',
      columnId: 'optimization',
      title: t.task_perform_memory_check_55,
      description: t.task_stay_under_the_100k__56,
      subTasks: [
        { id: 'st-opt-3-1', title: t.task_open_project_size_to_57, completed: false },
        { id: 'st-opt-3-2', title: t.task_identify_expensive_a_58, completed: false },
      ],
      tips: [t.task_reuse_assets_to_save_59],
      notes: '',
    },
    {
      id: 'task-opt-4',
      columnId: 'optimization',
      title: t.task_check_world_partitio_60,
      description: t.task_load_and_unload_area_61,
      subTasks: [
        { id: 'st-opt-4-1', title: t.task_adjust_loading_range_62, completed: false },
        { id: 'st-opt-4-2', title: t.task_check_data_layers_63, completed: false },
      ],
      tips: [t.task_large_maps_need_clea_64],
      notes: '',
    },
    // Release

    {
      id: 'task-opt-5',
      columnId: 'optimization',
      title: t.task_localize_project_1001,
      description: t.task_translate_ui_texts__1002,
      subTasks: [
        { id: 'st-opt-5-1', title: t.task_add_string_tables_1003, completed: false },
        { id: 'st-opt-5-2', title: t.task_translate_to_engli_1004, completed: false },
      ],
      tips: [t.task_more_languages_eq__1005],
      notes: ''
    },
    {
      id: 'task-rel-1',
      columnId: 'release',
      title: t.task_private_playtest_mul_65,
      description: t.task_test_with_real_playe_66,
      subTasks: [
        { id: 'st-rel-1-1', title: t.task_publish_private_vers_67, completed: false },
        { id: 'st-rel-1-2', title: t.task_send_codes_to_tester_68, completed: false },
      ],
      tips: [t.task_use_the_creator_port_69],
      notes: '',
    },

    {
      id: 'task-rel-2',
      columnId: 'release',
      isCritical: true,
      title: t.task_create_1920x1080_thu_76,
      description: t.task_the_face_of_your_map_77,
      subTasks: [
        { id: 'st-rel-2-1', title: t.task_take_high_res_screen_78, completed: false },
        { id: 'st-rel-2-2', title: t.task_add_logo_text_79, completed: false },
      ],
      tips: [t.task_no_clickbait_arrows__80],
      notes: '',
    },
    {
      id: 'task-rel-3',
      columnId: 'release',
      title: t.task_creator_portal_iarc__81,
      description: t.task_the_final_step__82,
      subTasks: [
        { id: 'st-rel-3-1', title: t.task_fill_out_iarc_questi_83, completed: false },
        { id: 'st-rel-3-2', title: t.task_map_description_tags_84, completed: false },
        { id: 'st-rel-3-3', title: t.task_publish_for_review_85, completed: false },
      ],
      tips: [t.task_check_all_copyright__86],
      notes: '',
    },
  ];

  const templateSpecificTasks: Task[] = [];
  const addTasks = (tasks: Task[]) => templateSpecificTasks.push(...tasks);

  if (template === 'zone-wars') {
    addTasks([
      {
        id: 'zw-1',
        columnId: 'logic',
        title: t.task_storm_controller_bea_87,
        description: t.task_the_zone_must_move__88,
        subTasks: [
          { id: 'st-zw-1-1', title: t.task_place_basic_storm_co_89, completed: false },
          { id: 'st-zw-1-2', title: t.task_define_phases_90, completed: false },
        ],
        tips: [t.task_use_advanced_storm_b_91],
        notes: '',
      },
      {
        id: 'zw-2',
        columnId: 'logic',
        title: t.task_randomized_loadout_g_92,
        description: t.task_random_weapons_for_p_93,
        subTasks: [
          { id: 'st-zw-2-1', title: t.task_fill_item_granters_94, completed: false },
          { id: 'st-zw-2-2', title: t.task_setup_randomization__95, completed: false },
        ],
        tips: [t.task_verse_can_help_distr_96],
        notes: '',
      }
    ]);
  }

  if (template === 'tycoon') {
    addTasks([
      {
        id: 'ty-1',
        columnId: 'logic',
        title: t.task_button_devices_purch_97,
        description: t.task_build_the_economy_sy_98,
        subTasks: [
          { id: 'st-ty-1-1', title: t.task_conditional_buttons__99, completed: false },
          { id: 'st-ty-1-2', title: t.task_currency_gold_setup_100, completed: false },
        ],
        tips: [t.task_link_buttons_with_vi_101],
        notes: '',
      },
      {
        id: 'ty-2',
        columnId: 'logic',
        title: t.task_vending_machines_102,
        description: t.task_sell_weapons_and_ite_103,
        subTasks: [
          { id: 'st-ty-2-1', title: t.task_set_prices_104, completed: false },
          { id: 'st-ty-2-2', title: t.task_limit_stock_optional_105, completed: false },
        ],
        tips: [t.task_vending_machines_are_106],
        notes: '',
      },
      {
        id: 'ty-3',
        columnId: 'logic',
        title: t.task_player_save_device_107,
        description: t.task_save_progress_across_108,
        subTasks: [
          { id: 'st-ty-3-1', title: t.task_place_save_point_dev_109, completed: false },
          { id: 'st-ty-3-2', title: t.task_auto_save_intervals_110, completed: false },
        ],
        tips: [t.task_important_for_tycoon_111],
        notes: '',
      }
    ]);
  }

  if (template === 'bed-wars') {
    addTasks([
      {
        id: 'bw-1',
        columnId: 'logic',
        title: t.task_bed_protection_logic_112,
        description: t.task_the_bed_must_be_dest_113,
        subTasks: [
          { id: 'st-bw-1-1', title: t.task_place_objective_devi_114, completed: false },
          { id: 'st-bw-1-2', title: t.task_link_respawn_logic_t_115, completed: false },
        ],
        tips: [t.task_use_verse_to_control_116],
        notes: '',
      },
      {
        id: 'bw-2',
        columnId: 'logic',
        title: t.task_resource_generators_117,
        description: t.task_spawn_iron_gold_and__118,
        subTasks: [
          { id: 'st-bw-2-1', title: t.task_item_spawner_for_res_119, completed: false },
          { id: 'st-bw-2-2', title: t.task_upgrade_system_for_g_120, completed: false },
        ],
        tips: [t.task_timer_devices_can_co_121],
        notes: '',
      }
    ]);
  }

  if (template === 'horror') {
    addTasks([
      {
        id: 'hr-1',
        columnId: 'environment',
        title: t.task_atmospheric_fog_ligh_122,
        description: t.task_create_a_spooky_mood_123,
        subTasks: [
          { id: 'st-hr-1-1', title: t.task_configure_exponentia_124, completed: false },
          { id: 'st-hr-1-2', title: t.task_flickering_lights_ve_125, completed: false },
        ],
        tips: [t.task_darkness_is_good_but_126],
        notes: '',
      },
      {
        id: 'hr-2',
        columnId: 'logic',
        title: t.task_jumpscare_triggers_127,
        description: t.task_scare_your_players__128,
        subTasks: [
          { id: 'st-hr-2-1', title: t.task_link_trigger_with_au_129, completed: false },
          { id: 'st-hr-2-2', title: t.task_vfx_spawner_for_visu_130, completed: false },
        ],
        tips: [t.task_timing_is_everything_131],
        notes: '',
      }
    ]);
  }

  if (template === 'racing') {
    addTasks([
      {
        id: 'rc-1',
        columnId: 'logic',
        title: t.task_checkpoint_system_132,
        description: t.task_define_the_race_trac_133,
        subTasks: [
          { id: 'st-rc-1-1', title: t.task_place_race_checkpoin_134, completed: false },
          { id: 'st-rc-1-2', title: t.task_setup_lap_counter_135, completed: false },
        ],
        tips: [t.task_use_the_race_manager_136],
        notes: '',
      },
      {
        id: 'rc-2',
        columnId: 'logic',
        title: t.task_vehicle_spawners_137,
        description: t.task_cars_for_the_players_138,
        subTasks: [
          { id: 'st-rc-2-1', title: t.task_sports_car_or_octane_139, completed: false },
          { id: 'st-rc-2-2', title: t.task_vehicle_modification_140, completed: false },
        ],
        tips: [t.task_ensure_enough_space__141],
        notes: '',
      }
    ]);
  }

  if (template === 'box-fight') {
    addTasks([
      {
        id: 'bf-1',
        columnId: 'logic',
        title: t.task_barrier_setup_142,
        description: t.task_separate_players_at__143,
        subTasks: [
          { id: 'st-bf-1-1', title: t.task_place_barrier_device_144, completed: false },
          { id: 'st-bf-1-2', title: t.task_auto_disable_after_x_145, completed: false },
        ],
        tips: [t.task_use_a_timer_to_contr_146],
        notes: '',
      }
    ]);
  }

  if (template === 'prop-hunt') {
    addTasks([
      {
        id: 'ph-1',
        columnId: 'logic',
        title: t.task_prop_o_matic_setup_147,
        description: t.task_transform_players_in_148,
        subTasks: [
          { id: 'st-ph-1-1', title: t.task_prop_o_matic_manager_149, completed: false },
          { id: 'st-ph-1-2', title: t.task_hider_vs_seeker_team_150, completed: false },
        ],
        tips: [t.task_hide_good_props_arou_151],
        notes: '',
      }
    ]);
  }

  if (template === 'red-vs-blue') {
    addTasks([
      {
        id: 'rvb-1',
        columnId: 'logic',
        title: t.task_team_base_setup_152,
        description: t.task_two_bases_with_weapo_153,
        subTasks: [
          { id: 'st-rvb-1-1', title: t.task_red_base_with_spawns_154, completed: false },
          { id: 'st-rvb-1-2', title: t.task_blue_base_with_spawn_155, completed: false },
          { id: 'st-rvb-1-3', title: t.task_setup_weapon_walls_156, completed: false },
        ],
        tips: [t.task_symmetry_is_importan_157],
        notes: '',
      }
    ]);
  }

  // Always add Verse task if not blank
  if (template !== 'blank') {
    addTasks([{
      id: 'verse-1',
      columnId: 'logic',
      title: t.task_create_verse_device__158,
      description: t.task_write_custom_logic__159,
      subTasks: [
        { id: 'st-v-1', title: t.task_new_verse_file_in_ex_160, completed: false },
        { id: 'st-v-2', title: t.task_build_verse_code_161, completed: false },
        { id: 'st-v-3', title: t.task_drag_device_into_map_162, completed: false },
      ],
      tips: [t.task_verse_is_powerful_fo_163],
      notes: '',
    }]);
  }

  return [...baseTasks, ...templateSpecificTasks];

};
